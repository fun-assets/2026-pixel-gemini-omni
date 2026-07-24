import { memo, useContext, useEffect, useRef, useState } from 'react';
import { getVideoDevices } from './misc';
import { GameContext, GamePagesType } from '../../../config';
import { Context } from '@/settings/constant';
import { ActionType } from '@/settings/type';

const Controller = memo(() => {
  const [, setContext] = useContext(Context);
  const [, setState] = useContext(GameContext);
  const isMountedRef = useRef(true);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [webcamDeviceId, setWebcamDeviceId] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWebcamDeviceId(e.target.value);
  };

  useEffect(() => {
    (async () => {
      try {
        const videoDevices = await getVideoDevices();
        if (!isMountedRef.current) return;
        setDevices(videoDevices);
      } catch (err) {
        setContext({
          type: ActionType.Modal,
          state: { enabled: true, title: 'Error', body: 'Error loading webcam devices' },
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (!webcamDeviceId) return;
    setState((S) => ({ ...S, webcamDeviceId, step: GamePagesType.startGame }));
  }, [webcamDeviceId]);

  return <div className='controller'></div>;
});
export default Controller;
