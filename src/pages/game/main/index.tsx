import Blockquote from '@/components/blockquote';
import Section from '@/components/section';
import { useContext, useEffect } from 'react';
import Lower from './lower';
import Medium from './medium';
import Upper from './upper';
import './index.less';
import { GameContext, GameLowerStepType, WebcamForceOpen } from '../config';
import { getVideoDevices } from './lower/webcam/misc';

const Main = () => {
  const [{ step }, setState] = useContext(GameContext);
  useEffect(() => {
    getVideoDevices()
      .then((devices) => {
        if (devices.length > 0) {
          setState((prev) => ({
            ...prev,
            webcamDeviceId:
              prev.webcamDeviceId || (WebcamForceOpen ? devices[0].deviceId : undefined),
          }));
        }
      })
      .catch(() => {
        // The picker handles camera permission errors and user-facing messaging.
        setState((prev) => ({ ...prev, step: GameLowerStepType.error }));
      });
  }, []);
  return (
    <div className='Main'>
      {step !== GameLowerStepType.preview && (
        <>
          <Blockquote height='upper'>
            <Section width='w-full'>
              <Upper />
            </Section>
          </Blockquote>
          <Blockquote height='medium'>
            <Section width='70%'>
              <Medium.Left />
            </Section>
            <Section width='flex-1'>
              <Medium.Right />
            </Section>
          </Blockquote>
        </>
      )}
      <Blockquote height='lower'>
        <Section width='w-full'>
          <Lower />
        </Section>
      </Blockquote>
    </div>
  );
};
export default Main;
