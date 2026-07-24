import { memo, useContext, useMemo } from 'react';
import { GameWebcamStepsContext, GameWebcamStepsStepType } from '../config';
import './index.less';
import Logo from './logo';

const Steps = memo(() => {
  const [state] = useContext(GameWebcamStepsContext);
  const page = useMemo(() => {
    switch (state.step) {
      case GameWebcamStepsStepType.logoShowing:
        return <Logo />;
    }
  }, [state]);
  return <div className='Steps'>{page}</div>;
});
export default Steps;
