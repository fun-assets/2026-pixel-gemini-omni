import { memo, useCallback, useContext, useMemo } from 'react';
import { GameContext, GameStepType } from '../../config';
import Controller from './controller';
import './index.less';
import Video from './video';

const Webcam = memo(() => {
  const [state] = useContext(GameContext);

  const components = useMemo(() => {
    switch (state.step) {
      case GameStepType.chooseWebcam:
        return <Controller />;
      case GameStepType.startGame:
        return <Video />;
    }
  }, [state.step]);

  const onCapture = useCallback(() => {}, []);

  return (
    <div className='Webcam'>
      <div>{components}</div>
      <div>
        <button className='btn' onClick={onCapture}>
          capture
        </button>
      </div>
    </div>
  );
});
export default Webcam;
