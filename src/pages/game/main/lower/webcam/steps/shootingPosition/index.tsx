import LiquidGlassButton from '@/components/LiquidGlassButton';
import TweenerProvider from '@/components/tweenProvider';
import { TransitionType } from '@/settings/type';
import OnloadProvider from 'lesca-react-onload';
import { memo, useContext, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { GameWebcamStepsContext, GameWebcamStepsStepType } from '../../config';
import './index.less';
import useTracker, { track } from '@/hooks/useTracker';

const ShootingPosition = memo(() => {
  const [, setStepState] = useContext(GameWebcamStepsContext);
  const [transition, setTransition] = useState(TransitionType.Unset);
  const [ctaEnd, setCtaEnd] = useState(false);

  useTracker({ pageName: '拍攝位置', type: 'pageView' });

  return (
    <OnloadProvider onload={() => setTransition(TransitionType.FadeIn)}>
      <div className='ShootingPosition'>
        <TweenerProvider
          className='flex w-full flex-row justify-center'
          initialStyle={{ opacity: 0, y: 50 }}
          options={{ duration: 500, delay: 500 }}
          tweenTo={{ opacity: 1, y: 0 }}
          shouldFadeIn={transition === TransitionType.FadeIn}
        >
          <div className='h1' />
        </TweenerProvider>
        <TweenerProvider
          className='flex w-full flex-row justify-center'
          initialStyle={{ opacity: 0, y: 50 }}
          options={{ duration: 500, delay: 550 }}
          tweenTo={{ opacity: 1, y: 0 }}
          shouldFadeIn={transition === TransitionType.FadeIn}
        >
          <div className='h2' />
        </TweenerProvider>
        <TweenerProvider
          className='flex w-full flex-row justify-center'
          initialStyle={{ opacity: 0, x: -50 }}
          tweenTo={{ opacity: 1, x: 0 }}
          options={{ duration: 500, delay: 1000, onEnd: () => setCtaEnd(true) }}
          shouldFadeIn={transition === TransitionType.FadeIn}
        >
          <LiquidGlassButton
            shape='pill'
            className='mt-5'
            size={75}
            width='80%'
            wobbleAmount={0.05}
            wobbleSpeed={2}
            shadow
            blur={0}
            tint={0}
            onClick={() => {
              setTimeout(() => {
                setStepState((S) => ({ ...S, step: GameWebcamStepsStepType.countDown }));
                track({ pageName: '拍攝位置-準備好了', type: 'event' });
              }, 500);
            }}
          >
            <div className='cta'>
              <div />
              <div className={twMerge(ctaEnd && 'animate-entry')} />
            </div>
          </LiquidGlassButton>
        </TweenerProvider>
      </div>
    </OnloadProvider>
  );
});
export default ShootingPosition;
