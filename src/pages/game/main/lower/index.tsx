import { memo, useContext, useMemo } from 'react';
import { GameContext, GameLowerStepType } from '../../config';
import Choose from './choose';
import Entry from './entry';
import './index.less';
import Webcam from './webcam';

const Lower = memo(() => {
  const [state] = useContext(GameContext);
  const page = useMemo(() => {
    switch (state.page) {
      case GameLowerStepType.entry:
        return <Entry />;
      case GameLowerStepType.choose:
        return <Choose />;
      case GameLowerStepType.webcam:
        return <Webcam />;
    }
  }, [state]);
  return <div className='Lower'>{page}</div>;
});
export default Lower;
