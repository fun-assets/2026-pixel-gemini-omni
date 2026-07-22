import { memo, useContext, useMemo } from 'react';
import { GameContext, GamePagesType } from '../config';
import Choose from './choose';
import Entry from './entry';
import './index.less';
import Webcam from './webcam';

const Lower = memo(() => {
  const [state] = useContext(GameContext);
  const page = useMemo(() => {
    switch (state.page) {
      case GamePagesType.entry:
        return <Entry />;
      case GamePagesType.choose:
        return <Choose />;
      case GamePagesType.webcam:
        return <Webcam />;
    }
  }, [state]);
  return <div className='Lower'>{page}</div>;
});
export default Lower;
