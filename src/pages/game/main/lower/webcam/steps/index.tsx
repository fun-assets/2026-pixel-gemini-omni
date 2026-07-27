import { memo, useContext, useMemo } from 'react';
import { GameWebcamStepsContext, GameWebcamStepsStepType } from '../config';
import './index.less';
import Logo from './logo';
import ShootingPosition from './shootingPosition';
import CountDown from './countDown';
import CaptureAndConfirm from './captureAndConfirm';

const Steps = memo(({ onCapture }: { onCapture: () => ImageData | undefined }) => {
  const [state] = useContext(GameWebcamStepsContext);
  const page = useMemo(() => {
    switch (state.step) {
      case GameWebcamStepsStepType.shootingPosition:
        return <ShootingPosition />;

      case GameWebcamStepsStepType.countDown:
        return <CountDown />;

      case GameWebcamStepsStepType.captureAndConfirm:
        return <CaptureAndConfirm onCapture={onCapture} />;

      default:
        return null;
    }
  }, [state]);
  return (
    <div className='Steps'>
      {page}
      <Logo />
    </div>
  );
});
export default Steps;
