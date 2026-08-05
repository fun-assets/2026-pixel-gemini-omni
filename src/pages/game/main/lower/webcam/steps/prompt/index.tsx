import TweenerProvider from '@/components/tweenProvider';
import { GameContext, GameLowerStepType } from '@/pages/game/config';
import { TransitionType } from '@/settings/type';
import CharTransition from 'lesca-react-char-transition';
import OnloadProvider from 'lesca-react-onload';
import { Bezier } from 'lesca-use-tween';
import { memo, useContext, useEffect, useState } from 'react';
import './index.less';
import { GameStyles } from '@/settings/config';
import LiquidGlassButton from '@/components/LiquidGlassButton';

const CharTransitionComponent =
  (CharTransition as unknown as { default?: typeof CharTransition }).default ?? CharTransition;

const Prompt = memo(() => {
  const [{ styleSelected }, setState] = useContext(GameContext);
  const promptText =
    GameStyles[styleSelected % GameStyles.length]?.simplify ?? GameStyles[0].simplify;
  const [transition, setTransition] = useState(TransitionType.Unset);

  useEffect(() => {
    setState((S) => ({ ...S, readyToGenerateVideo: true }));
  }, []);

  return (
    <OnloadProvider onload={() => setTransition(TransitionType.FadeIn)}>
      <div className='Prompt'>
        <TweenerProvider
          className='flex h-[50%] w-full items-center justify-center'
          initialStyle={{ opacity: 0, y: '200%' }}
          tweenTo={{ opacity: 1, y: '0%' }}
          shouldFadeIn={transition === TransitionType.FadeIn}
          options={{
            duration: 1000,
            onEnd: () => {
              setTransition(TransitionType.Loop);
            },
          }}
          fadeOutStyle={{ opacity: 0, y: '-200%' }}
          shouldFadeOut={transition === TransitionType.FadeOut}
          optionsFadeOut={{
            duration: 500,
            easing: Bezier.inQuart,
            onEnd: () => {
              setState((S) => ({ ...S, step: GameLowerStepType.processing }));
            },
          }}
        >
          <div className='dialog'>
            <div>
              {transition === TransitionType.Loop || transition === TransitionType.FadeOut ? (
                <CharTransitionComponent
                  duration={promptText.length * 100}
                  delay={0}
                  list={['　']}
                  preChar='　'
                  fps={60}
                  easing={Bezier.linear}
                >
                  {promptText}
                </CharTransitionComponent>
              ) : (
                <>
                  {promptText.split('').map((char, index) => (
                    <span className='invisible opacity-0' key={char + index}>
                      {char}
                    </span>
                  ))}
                </>
              )}
              <div className='w-2' />
            </div>
            <div>
              <div className='menu'>
                <div className='add' />
                <div className='type' />
              </div>
              <div className='mic' />
            </div>
          </div>
        </TweenerProvider>
        <TweenerProvider
          className='flex w-full justify-center'
          initialStyle={{ opacity: 0, x: -50 }}
          options={{ duration: 600, delay: 400 }}
          tweenTo={{ opacity: 1, x: 0 }}
          shouldFadeIn={transition === TransitionType.FadeIn}
          fadeOutStyle={{ opacity: 0 }}
          shouldFadeOut={transition === TransitionType.FadeOut}
        >
          <LiquidGlassButton
            shape='pill'
            size={70}
            width='50%'
            wobbleAmount={0.05}
            wobbleSpeed={2}
            shadow
            blur={0}
            tint={0}
            onClick={() => {
              setState((S) => ({ ...S, fakeSendPrompt: true }));
              setTransition(TransitionType.FadeOut);
            }}
          >
            <div className='font-noto-sans-tc text-3xl font-black'>送出</div>
          </LiquidGlassButton>
        </TweenerProvider>
      </div>
    </OnloadProvider>
  );
});
export default Prompt;
