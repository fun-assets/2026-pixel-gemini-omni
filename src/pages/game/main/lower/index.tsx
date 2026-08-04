import { memo, useContext, useMemo } from 'react';
import { GameContext, GameLowerStepType } from '../../config';
import ChooseStyle from './chooseStyle';
import Entry from './entry';
import Error from './error';
import Guide from './guide';
import './index.less';
import Preview from './preview';
import Processing from './processing';
import Qrcode from './qrcode';
import Webcam from './webcam';

const Lower = memo(() => {
  const [state] = useContext(GameContext);
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

      case GameLowerStepType.preview:
        return <Preview />;

      case GameLowerStepType.error:
        return <Error />;

      case GameLowerStepType.guide:
        return <Guide />;

      case GameLowerStepType.qrcode:
        return <Qrcode />;
    }
  }, [state]);
  return <div className='Lower'>{page}</div>;
});
export default Lower;
