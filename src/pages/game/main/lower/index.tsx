import { memo, useContext, useMemo } from 'react';
import { GameContext, GameLowerStepType } from '../../config';
import Entry from './entry';
import './index.less';
import Webcam from './webcam';

const Lower = memo(() => {
  const [state] = useContext(GameContext);
  const page = useMemo(() => {
    switch (state.step) {
      case GameLowerStepType.entry:
        return <Entry />;

      case GameLowerStepType.webcam:
        return <Webcam />;

      case GameLowerStepType.qrcode:
        return <div>qrcode</div>;
    }
  }, [state]);
  return <div className='Lower'>{page}</div>;
});
export default Lower;
