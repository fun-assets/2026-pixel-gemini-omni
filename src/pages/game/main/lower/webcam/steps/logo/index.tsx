import { memo, useContext, useEffect } from 'react';
import { GameWebcamStepsContext, GameWebcamStepsStepType } from '../../config';
import useTween from 'lesca-use-tween';

const Logo = memo(() => {
  const [style, setStyle] = useTween({ opacity: 1, bottom: '48%', scale: 2 });
  const [state] = useContext(GameWebcamStepsContext);

  useEffect(() => {
    if (state.step === GameWebcamStepsStepType.logoShowing) {
    }
  }, [state.step]);

  return (
    <div className='logo' style={style}>
      <div />
    </div>
  );
});
export default Logo;
