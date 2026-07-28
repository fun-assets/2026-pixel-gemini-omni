import { memo, useContext, useMemo } from 'react';
import { GameContext, GameLowerStepType } from '../../config';
import ChooseStyle from './chooseStyle';
import Entry from './entry';
import './index.less';
import Webcam from './webcam';
import Processing from './processing';

const Lower = memo(() => {
  const [state, setState] = useContext(GameContext);
  const page = useMemo(() => {
    switch (state.step) {
      case GameLowerStepType.entry:
        return <Entry />;

      case GameLowerStepType.chooseStyle:
        return <ChooseStyle />;

      case GameLowerStepType.webcam:
        return <Webcam />;

      case GameLowerStepType.processing:
        return <Processing />;

      case GameLowerStepType.qrcode:
        return <div>qrcode</div>;
    }
  }, [state]);
  return (
    <div className='Lower'>
      {page}
      <button
        className='home'
        onClick={() => {
          setState((S) => ({ ...S, step: GameLowerStepType.entry }));
        }}
      />
    </div>
  );
});
export default Lower;
