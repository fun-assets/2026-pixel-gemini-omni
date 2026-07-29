import TweenerProvider from '@/components/tweenProvider';
import { TransitionType } from '@/settings/type';
import OnloadProvider from 'lesca-react-onload';
import { memo, useContext, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { GameWebcamStepsContext, GameWebcamStepsStepType } from '../../config';
import './index.less';
import { GameContext } from '@/pages/game/config';

const CaptureAndConfirm = memo(() => {
  const [{ retakeAmount }, setState] = useContext(GameContext);
  const [, setStepState] = useContext(GameWebcamStepsContext);
  const [transition, setTransition] = useState(TransitionType.Unset);
  const [ctaEnd, setCtaEnd] = useState(false);

  return (
    <OnloadProvider onload={() => setTransition(TransitionType.FadeIn)}>
      <div className='CaptureAndConfirm'>
        {retakeAmount > 0 && (
          <TweenerProvider
            className='flex w-full flex-row justify-center'
            initialStyle={{ opacity: 0, x: -50 }}
            tweenTo={{ opacity: 1, x: 0 }}
            options={{ duration: 500, delay: 500, onEnd: () => setCtaEnd(true) }}
            shouldFadeIn={transition === TransitionType.FadeIn}
          >
            <button
              className='retake'
              onClick={() => {
                setState((S) => ({ ...S, retakeAmount: S.retakeAmount - 1, resultBase64: '' }));
                setStepState((S) => ({
                  ...S,
                  step: GameWebcamStepsStepType.shootingPosition,
                }));
              }}
            >
              <div />
              <div className={twMerge(ctaEnd && 'animate-entry')} />
            </button>
          </TweenerProvider>
        )}
        <TweenerProvider
          className='flex w-full flex-row justify-center'
          initialStyle={{ opacity: 0, x: -50 }}
          tweenTo={{ opacity: 1, x: 0 }}
          options={{
            duration: 500,
            delay: 500 + (retakeAmount > 0 ? 50 : 0),
            onEnd: () => setCtaEnd(true),
          }}
          shouldFadeIn={transition === TransitionType.FadeIn}
        >
          <button
            className='cta'
            onClick={() => {
              setStepState((S) => ({ ...S, step: GameWebcamStepsStepType.prompt }));
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
export default CaptureAndConfirm;
