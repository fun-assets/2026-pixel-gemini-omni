import { memo, useContext } from 'react';
import { GameContext, GameLowerStepType } from '../../../config';
import './index.less';

const Choose = memo(() => {
  const [, setState] = useContext(GameContext);
  return (
    <div className='Choose'>
      <button
        className='btn'
        onClick={() => {
          setState((S) => ({ ...S, page: GameLowerStepType.webcam }));
        }}
      >
        選filter
      </button>
    </div>
  );
});
export default Choose;
