import TweenerProvider from '@/components/tweenProvider';
import { TransitionType } from '@/settings/type';
import OnloadProvider from 'lesca-react-onload';
import { memo, useContext, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { GameWebcamStepsContext, GameWebcamStepsStepType } from '../../config';
import './index.less';

const CaptureAndConfirm = memo(({ onCapture }: { onCapture: () => ImageData | undefined }) => {
  const [, setStepState] = useContext(GameWebcamStepsContext);
  const [transition, setTransition] = useState(TransitionType.Unset);
  const [ctaEnd, setCtaEnd] = useState(false);

  useEffect(() => {
    const base64 = onCapture();
  }, []);

  return (
    <OnloadProvider onload={() => setTransition(TransitionType.FadeIn)}>
      <div className='CaptureAndConfirm'>
        <TweenerProvider
          className='flex w-full flex-row justify-center'
          initialStyle={{ opacity: 0, x: -50 }}
          tweenTo={{ opacity: 1, x: 0 }}
          options={{ duration: 500, delay: 500, onEnd: () => setCtaEnd(true) }}
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
