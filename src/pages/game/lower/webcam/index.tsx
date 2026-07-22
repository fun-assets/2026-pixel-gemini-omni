import { memo, useEffect, useRef } from 'react';
import './index.less';
import { startWebcam } from './misc';

const Webcam = memo(() => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      startWebcam({
        video: videoRef.current,
        onError: (err) => console.error('Webcam error: ', err),
      });
    }
  }, []);
  return (
    <div className='Webcam'>
      <video ref={videoRef} autoPlay playsInline muted></video>
    </div>
  );
});
export default Webcam;
