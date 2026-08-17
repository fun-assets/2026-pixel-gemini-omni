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
import { GameWebcamStepsContext, GameWebcamStepsStepType } from '../config';
import { detachWebcam, normalizeDeviceId, startWebcam } from '../misc';

const CAPTURE_SCALE = 3;

const Video = forwardRef((_, ref) => {
  const [, setContext] = useContext(Context);
  const [state, setState] = useContext(GameContext);
  const [webcamState] = useContext(GameWebcamStepsContext);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isStreamReady, setIsStreamReady] = useState(false);
  // Portrait-shot stream (taller than wide) needs a CCW 90deg rotation to display as landscape.
  const [isPortraitStream, setIsPortraitStream] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const showsCapturedFrame =
    webcamState.step >= GameWebcamStepsStepType.captureAndConfirm && !!state.resultBase64;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      setContainerSize({ width: container.clientWidth, height: container.clientHeight });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

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

    const handleOrientation = () => {
      if (isDisposed) return;
      if (!videoElement.videoWidth || !videoElement.videoHeight) return;
      setIsPortraitStream(videoElement.videoHeight > videoElement.videoWidth);
    };

    videoElement.addEventListener('playing', handleReady);
    videoElement.addEventListener('waiting', handleNotReady);
    videoElement.addEventListener('stalled', handleNotReady);
    videoElement.addEventListener('loadedmetadata', handleOrientation);
    // Fires again if the phone is rotated mid-stream and the camera renegotiates resolution.
    videoElement.addEventListener('resize', handleOrientation);

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
      videoElement.removeEventListener('loadedmetadata', handleOrientation);
      videoElement.removeEventListener('resize', handleOrientation);
      detachWebcam(videoElement);
    };
  }, [state.webcamDeviceId, setContext]);

  const capture = useCallback(() => {
    const videoElement = videoRef.current;
    const container = containerRef.current;
    if (!videoElement || !container) return;

    // Use the container box (what the user actually sees), not the video
    // element's own box, since that gets swapped when rotated for portrait streams.
    const targetWidth = container.clientWidth;
    const targetHeight = container.clientHeight;
    const sourceWidth = videoElement.videoWidth;
    const sourceHeight = videoElement.videoHeight;
    if (!targetWidth || !targetHeight || !sourceWidth || !sourceHeight) return;

    const effTargetWidth = isPortraitStream ? targetHeight : targetWidth;
    const effTargetHeight = isPortraitStream ? targetWidth : targetHeight;
    const targetAspect = effTargetWidth / effTargetHeight;
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

    const maxScaleFromSource = Math.min(sWidth / effTargetWidth, sHeight / effTargetHeight);
    const actualScale = Math.min(CAPTURE_SCALE, maxScaleFromSource);

    const outputWidth = Math.max(1, Math.round(targetWidth * actualScale));
    const outputHeight = Math.max(1, Math.round(targetHeight * actualScale));
    // Pre-rotation draw size; swapped for portrait streams, same as output otherwise.
    const drawWidth = isPortraitStream ? outputHeight : outputWidth;
    const drawHeight = isPortraitStream ? outputWidth : outputHeight;

    const canvas = document.createElement('canvas');
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Keep capture consistent with preview transform: translate + scaleX(-1) + rotate.
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(-1, 1);
      if (isPortraitStream) ctx.rotate(-Math.PI / 2);
      ctx.drawImage(
        videoElement,
        sx,
        sy,
        sWidth,
        sHeight,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight,
      );
      const imageData = canvas.toDataURL('image/png');
      // window.open(imageData, '_blank')?.document.write(`<img src="${imageData}" />`);
      setState((prev) => ({ ...prev, resultBase64: imageData }));
      return imageData;
    }
  }, [isPortraitStream]);

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
    <div className='video' ref={containerRef}>
      {!showsCapturedFrame && !isStreamReady && (
        <div className='skeleton absolute top-0 h-full w-full' />
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute top-0 h-full w-full object-cover transition-opacity duration-200 ${
          showsCapturedFrame ? 'opacity-0' : isStreamReady ? 'opacity-100' : 'opacity-0'
        }`}
        style={
          isPortraitStream && containerSize.width && containerSize.height
            ? {
                top: '50%',
                left: '50%',
                width: containerSize.height,
                height: containerSize.width,
                transform: 'translate(-50%, -50%) scaleX(-1) rotate(-90deg)',
              }
            : { transform: 'scaleX(-1)' }
        }
      />
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
