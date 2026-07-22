import { memo, useContext, useEffect, useMemo, useRef } from 'react';
import { GameContext, GameStepType } from '../../config';
import './index.less';
import Controller from './controller';
import Video from './video';

const Webcam = memo(() => {
  const [state, setState] = useContext(GameContext);

  useEffect(() => {
    setState((S) => ({ ...S, step: GameStepType.chooseWebcam }));
  }, []);

  const components = useMemo(() => {
    switch (state.step) {
      case GameStepType.chooseWebcam:
        return <Controller />;
      case GameStepType.startGame:
        return <Video />;
    }
  }, [state.step]);

  return <div className='Webcam'>{components}</div>;
});
export default Webcam;
