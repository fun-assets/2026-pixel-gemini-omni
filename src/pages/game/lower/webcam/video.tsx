import { Context } from '@/settings/constant';
import { ActionType } from '@/settings/type';
import { memo, useContext, useEffect, useRef } from 'react';
import { GameContext } from '../../config';
import { startWebcam } from './misc';

const Video = memo(() => {
  const [, setContext] = useContext(Context);
  const [state] = useContext(GameContext);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!state.webcamDeviceId) return;
    if (!videoRef.current) return;
    startWebcam({
      video: videoRef.current,
      deviceId: state.webcamDeviceId || undefined,
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
  }, [state]);

  return (
    <div className='video'>
      <video ref={videoRef} autoPlay playsInline muted></video>
    </div>
  );
});
export default Video;
