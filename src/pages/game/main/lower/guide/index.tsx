import TweenerProvider from '@/components/tweenProvider';
import { TransitionType } from '@/settings/type';
import OnloadProvider from 'lesca-react-onload';
import { memo, useContext, useState } from 'react';
import './index.less';
import { GameContext, GameLowerStepType } from '@/pages/game/config';

const Guide = memo(() => {
  const [, setState] = useContext(GameContext);
  const [transition, setTransition] = useState(TransitionType.Unset);
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
          options={{ duration: 500, delay: 1000 }}
          shouldFadeIn={transition === TransitionType.FadeIn}
        >
          <button
            className='cta'
            onClick={() => {
              setState((S) => ({ ...S, step: GameLowerStepType.qrcode }));
            }}
          >
            <div />
            <div />
          </button>
        </TweenerProvider>
      </div>
    </OnloadProvider>
  );
});
export default Guide;
