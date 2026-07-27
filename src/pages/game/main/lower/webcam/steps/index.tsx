import { memo, useContext, useMemo } from 'react';
import { GameWebcamStepsContext, GameWebcamStepsStepType } from '../config';
import './index.less';
import Logo from './logo';
import ShootingPosition from './shootingPosition';

const Steps = memo(() => {
  const [state] = useContext(GameWebcamStepsContext);
  const page = useMemo(() => {
    switch (state.step) {
      case GameWebcamStepsStepType.shootingPosition:
        return <ShootingPosition />;
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
