import { Context } from '@/settings/constant';
import { ActionType } from '@/settings/type';
import { memo, useContext, useEffect, useRef, useState } from 'react';
import { GameContext, GamePagesType } from '../config';
import {
  AUTO_DEVICE_ID,
  getVideoDevices,
  normalizeDeviceId,
  startWebcam,
  stopWebcam,
} from '../main/lower/webcam/misc';
import Sounds from '@/components/sounds';

const WebcamDisplay = memo(() => {
  const [, setContext] = useContext(Context);
  const [state] = useContext(GameContext);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!state.webcamDeviceId) return;
    if (!videoRef.current) return;
    const videoElement = videoRef.current;
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
      stopWebcam(videoElement);
    };
  }, [state.webcamDeviceId, setContext]);

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

  const [soundsLoaded, setSoundsLoaded] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWebcamDeviceId(e.target.value);
  };

  useEffect(() => {
    if (soundsLoaded) {
      setState((S) => ({ ...S, page: GamePagesType.game }));
    }
  }, [soundsLoaded]);

  useEffect(() => {
    isMountedRef.current = true;
    (async () => {
      try {
        const videoDevices = await getVideoDevices();
        if (!isMountedRef.current) return;
        setDevices(videoDevices);
        setWebcamDeviceId((prev) => prev || videoDevices[0]?.deviceId || AUTO_DEVICE_ID);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error loading webcam devices';
        setContext({
          type: ActionType.Modal,
          state: { enabled: true, title: 'Error', body: message },
        });
      }
    })();
    return () => {
      isMountedRef.current = false;
    };
  }, [setContext]);

  useEffect(() => {
    if (!webcamDeviceId) return;
    setState((S) => ({ ...S, webcamDeviceId }));
  }, [webcamDeviceId]);

  const onError = (message: string) => {
    setContext({
      type: ActionType.Modal,
      state: {
        enabled: true,
        title: '系統訊息',
        body: message,
        label: ['確定'],
      },
    });
  };

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
          <legend className='fieldset-legend text-3xl'>Webcam selection</legend>
          <select
            defaultValue='Pick a webcam'
            className='select select-xl w-full'
            onChange={onChange}
          >
            {devices.map((device, index) => {
              return (
                <option
                  key={`${device.deviceId || 'camera'}-${index}`}
                  value={device.deviceId || AUTO_DEVICE_ID}
                >
                  {device.label || `Camera ${index + 1}`}
                </option>
              );
            })}
          </select>
        </fieldset>
        <button
          className='btn btn-xl w-full'
          disabled={!webcamDeviceId}
          onClick={() => {
            // full screen
            const tracks = new Sounds({
              onError,
              onload: () => {
                setSoundsLoaded(true);
              },
            });
            tracks.preload('onStart');
            setContext({ type: ActionType.Sounds, state: { tracks } });

            if (document.documentElement.requestFullscreen) {
              document.documentElement.requestFullscreen();
            }
          }}
        >
          Sure, let's go
        </button>
      </div>
    </div>
  );
});
export default WebcamPicker;
