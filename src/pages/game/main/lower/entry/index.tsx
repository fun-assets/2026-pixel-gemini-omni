import Columns from '@/components/columns';
import LiquidGlassButton from '@/components/LiquidGlassButton';
import TweenerProvider from '@/components/tweenProvider';
import { TransitionType } from '@/settings/type';
import OnloadProvider from 'lesca-react-onload';
import { useContext, useState } from 'react';
import './index.less';
import { GameContext, GameLowerStepType } from '@/pages/game/config';
import { twMerge } from 'tailwind-merge';

const Intro = () => {
  const [, setState] = useContext(GameContext);
  const [ctaEnd, setCtaEnd] = useState(false);
  const [transition, setTransition] = useState(TransitionType.Unset);

  return (
    <OnloadProvider onload={() => setTransition(TransitionType.FadeIn)}>
      <div className='flex h-full w-full flex-col items-center justify-center pt-[5%]'>
        <div className='flex w-full flex-col items-center'>
          <TweenerProvider
            className='flex w-full flex-row justify-center'
            initialStyle={{ opacity: 0, y: 50 }}
            options={{ duration: 500, delay: 0 }}
            tweenTo={{ opacity: 1, y: 0 }}
            shouldFadeIn={transition === TransitionType.FadeIn}
          >
            <div className='h1' />
          </TweenerProvider>
          <TweenerProvider
            className='flex w-full flex-row justify-center'
            initialStyle={{ opacity: 0, y: 50 }}
            options={{ duration: 500, delay: 50 }}
            tweenTo={{ opacity: 1, y: 0 }}
            shouldFadeIn={transition === TransitionType.FadeIn}
          >
            <div className='h2' />
          </TweenerProvider>
        </div>
        <div className='mt-[4%] flex w-full justify-center'>
          <TweenerProvider
            className='flex w-full justify-center'
            initialStyle={{ opacity: 0, x: -50 }}
            options={{ duration: 600, delay: 400, onEnd: () => setCtaEnd(true) }}
            tweenTo={{ opacity: 1, x: 0 }}
            shouldFadeIn={transition === TransitionType.FadeIn}
          >
            <LiquidGlassButton
              shape='pill'
              size={40}
              width={190}
              wobbleAmount={0.05}
              wobbleSpeed={2}
              shadow
              blur={0}
              tint={0}
              onClick={() => {
                setTimeout(() => {
                  setState((S) => ({ ...S, step: GameLowerStepType.chooseStyle, retakeAmount: 1 }));
                }, 500);
              }}
            >
              <div className='cta'>
                <div className='cta-name' />
                <div className={twMerge('cta-arrow', ctaEnd && 'animate-entry')} />
              </div>
            </LiquidGlassButton>
          </TweenerProvider>
        </div>
        <div className='relative mt-[15%] flex w-full justify-center [&>div]:w-full'>
          <TweenerProvider
            initialStyle={{ opacity: 0 }}
            options={{ duration: 200, delay: 0 }}
            tweenTo={{ opacity: 1 }}
            shouldFadeIn={transition === TransitionType.FadeIn}
          >
            <div className='description' />
          </TweenerProvider>
        </div>
      </div>
    </OnloadProvider>
  );
};

const Entry = () => {
  return (
    <div className='lower-inner'>
      <div className='Entry h-full w-full'>
        <Columns leftNode={<div className='mobile' />} rightNode={<Intro />} />
      </div>
    </div>
  );
};
export default Entry;
