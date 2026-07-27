import TweenerProvider from '@/components/tweenProvider';
import { GameContext, GameLowerStepType, GameStyles } from '@/pages/game/config';
import { TransitionType } from '@/settings/type';
import OnloadProvider from 'lesca-react-onload';
import { memo, useContext, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import './index.less';

type StyleItemProps = {
  data: { name: string; prompt: string };
  index: number;
  styleSelected?: number;
  setStyleSelected: React.Dispatch<React.SetStateAction<number | undefined>>;
  transition: TransitionType;
};

const StyleItem = memo(
  ({ data, index, styleSelected, setStyleSelected, transition }: StyleItemProps) => {
    return (
      <TweenerProvider
        initialStyle={{ opacity: 0, y: 50, rotate: -90 }}
        options={{ duration: 500, delay: 300 + index * 100 }}
        tweenTo={{ opacity: 1, y: 0, rotate: 0 }}
        shouldFadeIn={transition === TransitionType.FadeIn}
      >
        <div className='item'>
          <button
            className={twMerge(styleSelected === index ? 'selected' : '')}
            onClick={() => {
              setStyleSelected((prev) => (prev === index ? undefined : index));
            }}
          >
            <div className={twMerge('cover')}>
              <div className={`style-${index + 1}`} />
            </div>
            <span>{data.name}</span>
          </button>
        </div>
      </TweenerProvider>
    );
  },
);

const ChooseStyle = memo(() => {
  const [, setState] = useContext(GameContext);
  const [styleSelected, setStyleSelected] = useState<number | undefined>();
  const [transition, setTransition] = useState(TransitionType.Unset);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (styleSelected !== undefined) {
      setState((S) => ({ ...S, styleSelected }));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setState((S) => ({ ...S, step: GameLowerStepType.webcam }));
      }, 1000);
    }
  }, [styleSelected]);

  return (
    <OnloadProvider
      onload={() => {
        setTimeout(() => {
          setTransition(TransitionType.FadeIn);
        }, 1000);
      }}
    >
      <div className='ChooseStyle'>
        <div>
          <TweenerProvider
            initialStyle={{ opacity: 0, y: 50 }}
            options={{ duration: 500, delay: 50 }}
            tweenTo={{ opacity: 1, y: 0 }}
            shouldFadeIn={transition === TransitionType.FadeIn}
          >
            <div className='h1' />
          </TweenerProvider>
          <TweenerProvider
            initialStyle={{ opacity: 0, y: 50 }}
            options={{ duration: 500, delay: 150 }}
            tweenTo={{ opacity: 1, y: 0 }}
            shouldFadeIn={transition === TransitionType.FadeIn}
          >
            <div className='h2' />
          </TweenerProvider>
          <div className='styles'>
            {GameStyles.map((data, index) => (
              <StyleItem
                key={index}
                data={data}
                index={index}
                styleSelected={styleSelected}
                setStyleSelected={setStyleSelected}
                transition={transition}
              />
            ))}
          </div>
          <TweenerProvider
            className='flex w-full justify-center'
            initialStyle={{ opacity: 0 }}
            options={{ duration: 300, delay: 0 }}
            tweenTo={{ opacity: 1 }}
            shouldFadeIn={transition === TransitionType.FadeIn}
          >
            <div className='productName' />
          </TweenerProvider>
        </div>
      </div>
    </OnloadProvider>
  );
});
export default ChooseStyle;
