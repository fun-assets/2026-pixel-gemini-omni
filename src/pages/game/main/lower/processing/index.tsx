import { GameContext, GameLowerStepType } from '@/pages/game/config';
import { memo, useContext, useEffect } from 'react';
import './index.less';
import useTween, { Bezier } from 'lesca-use-tween';

const Processing = memo(() => {
  const [{ generatedVideo }, setState] = useContext(GameContext);
  const [style, setStyle] = useTween({ width: '0%' });

  useEffect(() => {
    setStyle({ width: '100%' }, { duration: 80000, easing: Bezier.linear });
  }, []);

  useEffect(() => {
    if (generatedVideo) {
      setStyle(
        { width: '100%' },
        {
          duration: 100,
          onEnd: () => {
            setState((S) => ({ ...S, step: GameLowerStepType.preview }));
          },
        },
      );
    }
  }, [generatedVideo]);

  return (
    <div className='Processing'>
      <div className='h1' />
      <div className='h2' />
      <div className='bar'>
        <div style={style} />
      </div>
    </div>
  );
});
export default Processing;
