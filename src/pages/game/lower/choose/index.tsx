import { memo, useContext, useEffect } from 'react';
import './index.less';
import { GameContext, GamePagesType } from '../../config';

const Choose = memo(() => {
  const [, setState] = useContext(GameContext);
  useEffect(() => {}, []);
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
