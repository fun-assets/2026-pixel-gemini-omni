import { memo } from 'react';
import './index.less';

const Game = memo(() => {
  const startWebcam = () => {
    // start webcam
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = document.getElementById('webcam') as HTMLVideoElement;
        if (!video) {
          return;
        }

        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play().catch((err) => {
            console.error('Error playing webcam stream: ', err);
          });
        };
      })
      .catch((err) => {
        console.error('Error accessing webcam: ', err);
      });
  };

  const onCapture = () => {
    const video = document.getElementById('webcam') as HTMLVideoElement;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      console.error('Webcam is not ready yet. Please wait a moment and try again.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');
      console.log(imageData);

      console.log('Captured image data: ', imageData);
    }
  };

  return (
    <div className='Game'>
      <video id='webcam' autoPlay playsInline muted></video>
      <div className='join'>
        <button onClick={startWebcam} className='btn join-item'>
          start webcam
        </button>
        <button onClick={onCapture} className='btn join-item'>
          capture
        </button>
      </div>
    </div>
  );
});
export default Game;
