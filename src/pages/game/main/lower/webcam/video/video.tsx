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
import { GameWebcamStepsContext, GameWebcamStepsStepType, WEBCAM_ZOOM_SCALE } from '../config';
import { detachWebcam, normalizeDeviceId, startWebcam } from '../misc';

const CAPTURE_SCALE = 3;

const Video = forwardRef((_, ref) => {
  const [, setContext] = useContext(Context);
  const [state, setState] = useContext(GameContext);
  const [webcamState] = useContext(GameWebcamStepsContext);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreamReady, setIsStreamReady] = useState(false);
  const showsCapturedFrame =
    webcamState.step >= GameWebcamStepsStepType.captureAndConfirm && !!state.resultBase64;

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
      detachWebcam(videoElement);
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

        // Match the preview's extra zoom: sample a smaller, centered region of the same crop.
        if (WEBCAM_ZOOM_SCALE !== 1) {
          const zoomedWidth = sWidth / WEBCAM_ZOOM_SCALE;
          const zoomedHeight = sHeight / WEBCAM_ZOOM_SCALE;
          sx += (sWidth - zoomedWidth) / 2;
          sy += (sHeight - zoomedHeight) / 2;
          sWidth = zoomedWidth;
          sHeight = zoomedHeight;
        }

        const maxScaleFromSource = Math.min(sWidth / targetWidth, sHeight / targetHeight);
        const actualScale = Math.min(CAPTURE_SCALE, maxScaleFromSource);

        const outputWidth = Math.max(1, Math.round(targetWidth * actualScale));
        const outputHeight = Math.max(1, Math.round(targetHeight * actualScale));

        const sourceCanvas = document.createElement('canvas');
        sourceCanvas.width = outputWidth;
        sourceCanvas.height = outputHeight;
        const sourceCtx = sourceCanvas.getContext('2d');
        if (sourceCtx) {
          sourceCtx.imageSmoothingEnabled = true;
          sourceCtx.imageSmoothingQuality = 'high';

          // Keep capture direction consistent with preview transform: scaleX(-1).
          sourceCtx.translate(sourceCanvas.width, 0);
          sourceCtx.scale(-1, 1);
          sourceCtx.drawImage(
            videoElement,
            sx,
            sy,
            sWidth,
            sHeight,
            0,
            0,
            sourceCanvas.width,
            sourceCanvas.height,
          );

          // Rotate -90deg (CCW) to match preview transform, swapping output dimensions.
          const canvas = document.createElement('canvas');
          canvas.width = sourceCanvas.height;
          canvas.height = sourceCanvas.width;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.drawImage(sourceCanvas, -sourceCanvas.width / 2, -sourceCanvas.height / 2);
            const imageData = canvas.toDataURL('image/png');
            // window.open(imageData, '_blank')?.document.write(`<img src="${imageData}" />`);
            setState((prev) => ({ ...prev, resultBase64: imageData }));
            return imageData;
          }
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
      {!showsCapturedFrame && !isStreamReady && (
        <div className='skeleton absolute top-0 h-full w-full' />
      )}
      <div
        className='video-rotator'
        style={{
          transform: `translate(-50%, -50%) rotate(-90deg) scaleX(-1) scale(${WEBCAM_ZOOM_SCALE})`,
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`transition-opacity duration-200 ${
            showsCapturedFrame ? 'opacity-0' : isStreamReady ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
      {showsCapturedFrame && (
        <div
          className='animate-camera-flash absolute top-0 h-full w-full bg-cover bg-center'
          style={{ backgroundImage: `url(${state.resultBase64})` }}
        />
      )}
    </div>
  );
});
export default Video;
