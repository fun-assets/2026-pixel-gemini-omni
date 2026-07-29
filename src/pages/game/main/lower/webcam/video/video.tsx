import { Context } from '@/settings/constant';
import { ActionType } from '@/settings/type';
import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { GameContext } from '../../../../config';
import { normalizeDeviceId, startWebcam, stopWebcam } from '../misc';

const CAPTURE_SCALE = 3;

const Video = forwardRef((_, ref) => {
  const [, setContext] = useContext(Context);
  const [state, setState] = useContext(GameContext);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [captured, setCaptured] = useState(false);
  const [isStreamReady, setIsStreamReady] = useState(false);

  useEffect(() => {
    if (!state.webcamDeviceId) return;
    if (!videoRef.current) return;
    const videoElement = videoRef.current;
    let isDisposed = false;

    const handleReady = () => {
      if (isDisposed) return;
      setIsStreamReady(true);
    };

    const handleNotReady = () => {
      if (isDisposed) return;
      setIsStreamReady(false);
    };

    videoElement.addEventListener('playing', handleReady);
    videoElement.addEventListener('waiting', handleNotReady);
    videoElement.addEventListener('stalled', handleNotReady);

    setCaptured(false);
    setIsStreamReady(false);
    startWebcam({
      video: videoElement,
      deviceId: normalizeDeviceId(state.webcamDeviceId),
      onError: (err) => {
        setContext({
          type: ActionType.Modal,
          state: {
            enabled: true,
            title: 'Error',
            body: `Error accessing webcam: ${err.message || err}`,
          },
        });
      },
    }).then(() => {});

    return () => {
      isDisposed = true;
      videoElement.removeEventListener('playing', handleReady);
      videoElement.removeEventListener('waiting', handleNotReady);
      videoElement.removeEventListener('stalled', handleNotReady);
      stopWebcam(videoElement);
    };
  }, [state.webcamDeviceId, setContext]);

  const capture = useCallback(() => {
    if (videoRef.current) {
      const videoElement = videoRef.current;
      if (videoElement) {
        const targetWidth = videoElement.clientWidth;
        const targetHeight = videoElement.clientHeight;
        const sourceWidth = videoElement.videoWidth;
        const sourceHeight = videoElement.videoHeight;
        if (!targetWidth || !targetHeight || !sourceWidth || !sourceHeight) return;

        const targetAspect = targetWidth / targetHeight;
        const sourceAspect = sourceWidth / sourceHeight;

        let sx = 0;
        let sy = 0;
        let sWidth = sourceWidth;
        let sHeight = sourceHeight;

        // Match CSS object-fit: cover crop area.
        if (sourceAspect > targetAspect) {
          sWidth = sourceHeight * targetAspect;
          sx = (sourceWidth - sWidth) / 2;
        } else {
          sHeight = sourceWidth / targetAspect;
          sy = (sourceHeight - sHeight) / 2;
        }

        const maxScaleFromSource = Math.min(sWidth / targetWidth, sHeight / targetHeight);
        const actualScale = Math.min(CAPTURE_SCALE, maxScaleFromSource);

        const outputWidth = Math.max(1, Math.round(targetWidth * actualScale));
        const outputHeight = Math.max(1, Math.round(targetHeight * actualScale));

        const canvas = document.createElement('canvas');
        canvas.width = outputWidth;
        canvas.height = outputHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Keep capture direction consistent with preview transform: scaleX(-1).
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(videoElement, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
          const imageData = canvas.toDataURL('image/png');
          // window.open(imageData, '_blank')?.document.write(`<img src="${imageData}" />`);
          setState((prev) => ({ ...prev, resultBase64: imageData }));
          setCaptured(true);
          return imageData;
        }
      }
    }
  }, []);

  useEffect(() => {
    setState((prev) => ({ ...prev, capture }));
  }, [capture]);

  useImperativeHandle(ref, () => ({
    getVideo() {
      return videoRef.current;
    },
    capture,
  }));

  return (
    <div className='video'>
      {!captured && !isStreamReady && <div className='skeleton absolute top-0 h-full w-full' />}
      {captured ? (
        <div
          className='absolute top-0 h-full w-full bg-cover bg-center'
          style={{ backgroundImage: `url(${state.resultBase64})` }}
        />
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute top-0 h-full w-full object-cover transition-opacity duration-200 ${
            isStreamReady ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
});
export default Video;
