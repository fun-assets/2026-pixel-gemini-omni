import { memo, useContext, useEffect } from 'react';
import './index.less';
import { GameContext, GameLowerStepType } from '../../../config';

const Entry = memo(() => {
  const [, setState] = useContext(GameContext);
  useEffect(() => {}, []);
  return (
    <div className='Entry'>
      <div />
      <div>
        <button
          className='btn btn-accent'
          onClick={() => {
            setState((S) => ({ ...S, page: GameLowerStepType.choose }));
          }}
        >
          Start
        </button>
      </div>
    </div>
  );
});
export default Entry;
