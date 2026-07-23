import { memo, useCallback, useContext, useMemo, useRef } from 'react';
import { GameContext, GameStepType } from '../../config';
import Controller from './controller';
import './index.less';
import Video from './video';

const CAPTURE_SCALE = 3;

const Webcam = memo(() => {
  const videoRef = useRef<{ getVideo: () => HTMLVideoElement | null }>(null);

  const [state] = useContext(GameContext);

  const components = useMemo(() => {
    switch (state.step) {
      case GameStepType.chooseWebcam:
        return <Controller />;
      case GameStepType.startGame:
        return <Video ref={videoRef} />;
    }
  }, [state.step]);

  const onCapture = useCallback(() => {
    if (videoRef.current) {
      const videoElement = videoRef.current.getVideo();
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
          window.open(imageData, '_blank')?.document.write(`<img src="${imageData}" />`);
        }
      }
    }
  }, []);

  return (
    <div className='Webcam'>
      <div>{components}</div>
      <div>
        <button className='btn' onClick={onCapture}>
          capture
        </button>
      </div>
    </div>
  );
});
export default Webcam;
