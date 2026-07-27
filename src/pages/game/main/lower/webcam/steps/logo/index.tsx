import { memo, useContext, useEffect } from 'react';
import { GameWebcamStepsContext, GameWebcamStepsStepType } from '../../config';
import useTween, { Bezier } from 'lesca-use-tween';

const Logo = memo(() => {
  const [style, setStyle] = useTween({
    opacity: 0,
    bottom: '48%',
    scale: 1.3,
    y: 50,
    x: 0,
    marginLeft: '0%',
  });
  const [state, setState] = useContext(GameWebcamStepsContext);

  useEffect(() => {
    if (state.step === GameWebcamStepsStepType.logoShowing) {
      setStyle(
        { opacity: 1, bottom: '48%', scale: 1.3, y: 0 },
        {
          duration: 800,
          easing: Bezier.inOutQuart,
          onEnd: () => {
            setTimeout(() => {
              setState((S) => ({ ...S, step: GameWebcamStepsStepType.shootingPosition }));
            }, 1000);
          },
        },
      );
    } else if (state.step >= GameWebcamStepsStepType.shootingPosition) {
      setStyle(
        { opacity: 1, bottom: '0%', scale: 1, y: 0, marginLeft: '-20%' },
        { duration: 800, easing: Bezier.inOutQuart },
      );
    }
  }, [state.step]);

  return (
    <div className='logo' style={style}>
      <div />
    </div>
  );
});
export default Logo;
