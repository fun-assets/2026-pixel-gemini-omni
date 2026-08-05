import TweenerProvider from '@/components/tweenProvider';
import { GameContext, GameLowerStepType } from '@/pages/game/config';
import { ActionType, TransitionType } from '@/settings/type';
import OnloadProvider from 'lesca-react-onload';
import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import './index.less';
import { GameStyles } from '@/settings/config';
import useTracker, { track } from '@/hooks/useTracker';
import { Context } from '@/settings/constant';

type StyleItemProps = {
  data: { name: string; prompt: string };
  index: number;
  styleSelected?: number;
  setStyleSelected: React.Dispatch<React.SetStateAction<number | undefined>>;
  transition: TransitionType;
};

const StyleItem = memo(({ index, styleSelected, setStyleSelected, transition }: StyleItemProps) => {
  const [context] = useContext(Context);
  const { tracks } = context[ActionType.Sounds]!;
  const [fadeIn, setFadeIn] = useState(false);

  const onClick = useCallback(() => {
    if (!fadeIn) return;
    setStyleSelected((prev) => (prev === index ? undefined : index));
    tracks?.play('button');
    track({ pageName: `選擇風格-${GameStyles[index].name}`, type: 'event' });
  }, [fadeIn, index, setStyleSelected]);
  return (
    <TweenerProvider
      initialStyle={{ opacity: 0, y: 50, rotate: -90 }}
      options={{ duration: 500, delay: 300 + index * 100, onEnd: () => setFadeIn(true) }}
      tweenTo={{ opacity: 1, y: 0, rotate: 0 }}
      shouldFadeIn={transition === TransitionType.FadeIn}
    >
      <div className='item'>
        <button className={twMerge(styleSelected === index ? 'selected' : '')} onClick={onClick}>
          <div className='cover'>
            <div className='h-full w-full overflow-hidden rounded-xl'>
              <video
                muted
                playsInline
                loop
                autoPlay
                src={GameStyles[index].video}
                className='h-full w-full object-cover'
              />
            </div>
          </div>
          <div className='name'>
            <div>{GameStyles[index].name}</div>
          </div>
        </button>
      </div>
    </TweenerProvider>
  );
});

const ChooseStyle = memo(() => {
  const [context] = useContext(Context);
  const { tracks } = context[ActionType.Sounds]!;

  const [, setState] = useContext(GameContext);
  const [styleSelected, setStyleSelected] = useState<number | undefined>();
  const [transition, setTransition] = useState(TransitionType.Unset);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useTracker({ pageName: '選擇風格', type: 'pageView' });

  useEffect(() => {
    if (styleSelected !== undefined) {
      setState((S) => ({ ...S, styleSelected }));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setState((S) => ({ ...S, step: GameLowerStepType.webcam }));
        tracks?.play('current');
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
