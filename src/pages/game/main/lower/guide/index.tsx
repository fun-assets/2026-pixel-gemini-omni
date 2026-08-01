import LiquidGlassButton from '@/components/LiquidGlassButton';
import TweenerProvider from '@/components/tweenProvider';
import { GameContext, GameLowerStepType } from '@/pages/game/config';
import { TransitionType } from '@/settings/type';
import OnloadProvider from 'lesca-react-onload';
import { memo, useContext, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import './index.less';
import useTracker, { track } from '@/hooks/useTracker';

const Guide = memo(() => {
  const [, setState] = useContext(GameContext);
  const [transition, setTransition] = useState(TransitionType.Unset);
  const [ctaEnd, setCtaEnd] = useState(false);

  useTracker({ pageName: '歡迎實機體驗', type: 'pageView' });

  return (
    <OnloadProvider onload={() => setTransition(TransitionType.FadeIn)}>
      <div className='Guide'>
        <TweenerProvider
          className='absolute flex h-full w-full justify-center'
          initialStyle={{ opacity: 0 }}
          tweenTo={{ opacity: 1 }}
          options={{ duration: 500 }}
          shouldFadeIn={transition === TransitionType.FadeIn}
        >
          <div className='logo' />
        </TweenerProvider>
        <TweenerProvider
          className='flex w-full justify-center'
          initialStyle={{ opacity: 0, y: 50 }}
          tweenTo={{ opacity: 1, y: 0 }}
          options={{ duration: 500, delay: 300 }}
          shouldFadeIn={transition === TransitionType.FadeIn}
        >
          <div className='h1' />
        </TweenerProvider>
        <TweenerProvider
          className='flex w-full justify-center'
          initialStyle={{ opacity: 0, y: 50 }}
          tweenTo={{ opacity: 1, y: 0 }}
          options={{ duration: 500, delay: 400 }}
          shouldFadeIn={transition === TransitionType.FadeIn}
        >
          <div className='h2' />
        </TweenerProvider>
        <TweenerProvider
          className='flex w-full justify-center'
          initialStyle={{ opacity: 0, x: -50 }}
          tweenTo={{ opacity: 1, x: 0 }}
          options={{ duration: 500, delay: 1000, onEnd: () => setCtaEnd(true) }}
          shouldFadeIn={transition === TransitionType.FadeIn}
        >
          <LiquidGlassButton
            shape='pill'
            size={40}
            width={240}
            wobbleAmount={0.05}
            wobbleSpeed={2}
            shadow
            blur={0}
            tint={0}
            onClick={() => {
              setTimeout(() => {
                setState((S) => ({ ...S, step: GameLowerStepType.qrcode }));
                track({ pageName: '歡迎實機體驗-沒問題!下載影片', type: 'event' });
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
export default Guide;
