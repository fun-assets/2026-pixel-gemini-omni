import { memo, useContext, useEffect, useRef, useState } from 'react';
import { getVideoDevices } from './misc';
import { GameContext, GameStepType } from '../../config';
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
    setState((S) => ({ ...S, webcamDeviceId, step: GameStepType.startGame }));
  }, [webcamDeviceId]);

  return (
    <div className='controller'>
      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>Webcam select</legend>
        <select defaultValue='Pick a webcam' className='select' onChange={onChange}>
          <option disabled={true}>Pick a webcam</option>
          {devices.map((device, index) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${index + 1}`}
            </option>
          ))}
        </select>
      </fieldset>
    </div>
  );
});
export default Controller;
