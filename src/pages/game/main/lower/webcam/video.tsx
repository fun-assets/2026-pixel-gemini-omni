import { Context } from '@/settings/constant';
import { ActionType } from '@/settings/type';
import { forwardRef, useContext, useEffect, useImperativeHandle, useRef } from 'react';
import { GameContext } from '../../../config';
import { startWebcam } from './misc';

const Video = forwardRef((_, ref) => {
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

  useImperativeHandle(ref, () => ({
    getVideo() {
      return videoRef.current;
    },
  }));

  return (
    <div className='video'>
      <div className='skeleton h-full w-full' />
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className='absolute top-0 h-full w-full object-cover'
      ></video>
    </div>
  );
});
export default Video;
