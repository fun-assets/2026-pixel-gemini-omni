import Columns from '@/components/columns';
import { memo, useRef, useState } from 'react';
import { GameWebcamStepsContext, GameWebcamStepsState } from './config';
import './index.less';
import Steps from './steps';
import Video from './video/video';

const Webcam = memo(() => {
  const value = useState(GameWebcamStepsState);
  const videoRef = useRef<{ getVideo: () => HTMLVideoElement }>(null);

  const onCapture = () => {
    const video = videoRef.current?.getVideo();
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      return imageData;
    }
  };

  return (
    <div className='Webcam'>
      <GameWebcamStepsContext.Provider value={value}>
        <Columns
          leftNode={<Video ref={videoRef} />}
          rightNode={<Steps onCapture={onCapture} />}
          gap='0'
        />
      </GameWebcamStepsContext.Provider>
    </div>
  );
});
export default Webcam;
