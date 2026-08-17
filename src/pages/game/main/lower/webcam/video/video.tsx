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
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreamReady, setIsStreamReady] = useState(false);
  // Video is rendered rotated -90deg (CCW), so it's laid out swapped (h x w) then rotated back to fill the container.
  const [videoBoxSize, setVideoBoxSize] = useState<{ width: number; height: number } | null>(null);
  const showsCapturedFrame =
    webcamState.step >= GameWebcamStepsStepType.captureAndConfirm && !!state.resultBase64;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      setVideoBoxSize({ width: container.clientWidth, height: container.clientHeight });
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
    <div className='video' ref={containerRef}>
      {!showsCapturedFrame && !isStreamReady && (
        <div className='skeleton absolute top-0 h-full w-full' />
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute top-1/2 left-1/2 object-cover transition-opacity duration-200 ${
          showsCapturedFrame ? 'opacity-0' : isStreamReady ? 'opacity-100' : 'opacity-0'
        }`}
        style={
          videoBoxSize
            ? {
                width: videoBoxSize.height,
                height: videoBoxSize.width,
                transform: 'translate(-50%, -50%) rotate(-90deg) scaleX(-1)',
              }
            : undefined
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
