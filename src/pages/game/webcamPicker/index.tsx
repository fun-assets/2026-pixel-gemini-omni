import { Context } from '@/settings/constant';
import { memo, useContext, useEffect, useRef, useState } from 'react';
import { GameContext, GamePagesType } from '../config';
import { getVideoDevices, startWebcam } from '../main/lower/webcam/misc';
import { ActionType } from '@/settings/type';

const WebcamDisplay = memo(() => {
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
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className='absolute h-full w-full rounded-3xl object-cover'
    />
  );
});

const WebcamPicker = memo(() => {
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
    setState((S) => ({ ...S, webcamDeviceId }));
  }, [webcamDeviceId]);

  return (
    <div className='bg-canyon-medium relative flex h-full w-full flex-col items-center justify-center rounded-3xl'>
      <div className='aspect-9/16 h-[40%] w-auto'>
        <div
          className='block h-full w-auto max-w-full object-cover object-center'
          style={{ transform: 'scaleX(-1)' }}
        >
          <WebcamDisplay />
        </div>
      </div>
      <div className='flex w-fit min-w-[80%] flex-col items-center justify-center'>
        <fieldset className='fieldset w-full'>
          <legend className='fieldset-legend'>Webcam selection</legend>
          <select defaultValue='Pick a webcam' className='select w-full' onChange={onChange}>
            <option disabled={true}>Pick a webcam</option>
            {devices.map((device, index) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${index + 1}`}
              </option>
            ))}
          </select>
        </fieldset>
        <button
          className='btn w-full'
          disabled={!webcamDeviceId}
          onClick={() => {
            setState((S) => ({ ...S, page: GamePagesType.game }));
          }}
        >
          Sure, let's go
        </button>
      </div>
    </div>
  );
});
export default WebcamPicker;
