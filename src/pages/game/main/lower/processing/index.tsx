import { GameContext, GameLowerStepType } from '@/pages/game/config';
import { memo, useContext, useEffect } from 'react';
import './index.less';

const Processing = memo(() => {
  const [{ generatedVideo }, setState] = useContext(GameContext);
  useEffect(() => {
    if (generatedVideo) {
      setState((S) => ({ ...S, step: GameLowerStepType.preview }));
    }
  }, [generatedVideo]);
  return (
    <div className='Processing'>
      <div className='h1' />
      <div className='h2' />
      <div className='bar'>
        <div />
      </div>
    </div>
  );
});
export default Processing;
