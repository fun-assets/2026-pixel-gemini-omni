import { memo, useContext } from 'react';
import { GameContext, GamePagesType } from '../../config';
import './index.less';

const Choose = memo(() => {
  const [, setState] = useContext(GameContext);
  return (
    <div className='Choose'>
      <button
        className='btn'
        onClick={() => {
          setState((S) => ({ ...S, page: GamePagesType.webcam }));
        }}
      >
        選filter
      </button>
    </div>
  );
});
export default Choose;
