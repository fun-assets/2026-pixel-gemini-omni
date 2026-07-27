import TweenerProvider from '@/components/tweenProvider';
import { GameContext, GameStyles } from '@/pages/game/config';
import { TransitionType } from '@/settings/type';
import CharTransition from 'lesca-react-char-transition';
import OnloadProvider from 'lesca-react-onload';
import { Bezier } from 'lesca-use-tween';
import { memo, useContext, useState } from 'react';
import { GameWebcamStepsContext, GameWebcamStepsStepType } from '../../config';
import './index.less';

const CharTransitionComponent =
  (CharTransition as unknown as { default?: typeof CharTransition }).default ?? CharTransition;

const Prompt = memo(() => {
  const [, setState] = useContext(GameWebcamStepsContext);
  const [{ styleSelected }] = useContext(GameContext);
  const promptText = GameStyles[styleSelected]?.prompt ?? GameStyles[0].prompt;
  const [transition, setTransition] = useState(TransitionType.Unset);

  return (
    <OnloadProvider onload={() => setTransition(TransitionType.FadeIn)}>
      <div className='Prompt'>
        <TweenerProvider
          className='flex h-full w-full items-center justify-center'
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
            delay: 2000,
            onEnd: () => {
              setState((S) => ({ ...S, step: GameWebcamStepsStepType.fetching }));
            },
          }}
        >
          <div className='dialog'>
            <div>
              {(transition === TransitionType.Loop || transition === TransitionType.FadeOut) && (
                <CharTransitionComponent
                  duration={promptText.length * 50}
                  delay={0}
                  list={['　']}
                  preChar='　'
                  fps={60}
                  easing={Bezier.linear}
                  onEnd={() => {
                    setTransition(TransitionType.FadeOut);
                  }}
                >
                  {promptText}
                </CharTransitionComponent>
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
      </div>
    </OnloadProvider>
  );
});
export default Prompt;
