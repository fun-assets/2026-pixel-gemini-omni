import TweenerProvider from '@/components/tweenProvider';
import { TransitionType } from '@/settings/type';
import OnloadProvider from 'lesca-react-onload';
import { memo, useContext, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { GameWebcamStepsContext, GameWebcamStepsStepType } from '../../config';
import './index.less';

const ShootingPosition = memo(() => {
  const [, setStepState] = useContext(GameWebcamStepsContext);
  const [transition, setTransition] = useState(TransitionType.Unset);
  const [ctaEnd, setCtaEnd] = useState(false);

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
          <button
            className='cta'
            onClick={() => {
              setStepState((S) => ({ ...S, step: GameWebcamStepsStepType.countDown }));
            }}
          >
            <div />
            <div className={twMerge(ctaEnd && 'animate-entry')} />
          </button>
        </TweenerProvider>
      </div>
    </OnloadProvider>
  );
});
export default ShootingPosition;
