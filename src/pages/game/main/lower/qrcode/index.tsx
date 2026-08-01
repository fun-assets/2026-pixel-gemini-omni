import TweenerProvider from '@/components/tweenProvider';
import { GameContext, GameLowerStepType } from '@/pages/game/config';
import { APP_URI } from '@/settings/config';
import { TransitionType } from '@/settings/type';
import OnloadProvider from 'lesca-react-onload';
import useTween, { Bezier } from 'lesca-use-tween';
import { memo, useContext, useEffect, useState } from 'react';
import './index.less';
import useTracker from '@/hooks/useTracker';

type CountDownProps = {
  transition: TransitionType;
  setTransition: (transition: TransitionType) => void;
};

const CountDown = memo(({ transition, setTransition }: CountDownProps) => {
  const [, setState] = useContext(GameContext);
  const [, setNum] = useTween({ x: 0 });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (transition === TransitionType.FadeIn) {
      setNum(
        { x: 30 },
        {
          duration: 2000,
          delay: 500,
          onUpdate: (v: { x: number }) => {
            const n = Math.floor(v.x);
            setN(n);
          },
          onEnd: (v: { x: number }) => {
            const n = Math.floor(v.x);
            setN(n);
            setTimeout(() => {
              setTransition(TransitionType.Loop);
            }, 2000);
          },
        },
      );
    } else if (transition === TransitionType.Loop) {
      setNum(
        { x: 0 },
        {
          duration: 30 * 1000,
          easing: Bezier.linear,
          onUpdate: (v: { x: number }) => {
            const n = Math.floor(v.x);
            setN(n);
          },
          onEnd: (v: { x: number }) => {
            const n = Math.floor(v.x);
            setN(n);
            setState((S) => ({ ...S, step: GameLowerStepType.entry }));
          },
        },
      );
    }
  }, [transition]);
  return <div>{n}</div>;
});

const Qrcode = memo(() => {
  const [{ cloudVideoURL }] = useContext(GameContext);
  const [transition, setTransition] = useState(TransitionType.Unset);

  useTracker({ pageName: '下載影片', type: 'pageView' });

  return (
    <OnloadProvider onload={() => setTransition(TransitionType.FadeIn)}>
      <div className='Qrcode'>
        <TweenerProvider
          className='absolute flex h-full w-full justify-center'
          initialStyle={{ opacity: 0 }}
          tweenTo={{ opacity: 1 }}
          options={{ duration: 500 }}
          shouldFadeIn={transition === TransitionType.FadeIn}
        >
          <div className='logo' />
        </TweenerProvider>
        <div className='inner'>
          <div className='codes'>
            <div>
              <TweenerProvider
                initialStyle={{ opacity: 0, y: 50 }}
                tweenTo={{ opacity: 1, y: 0 }}
                options={{ duration: 500 }}
                shouldFadeIn={transition === TransitionType.FadeIn}
                className='aspect-square h-full w-full rounded-2xl bg-white bg-contain bg-center bg-no-repeat'
                style={{
                  backgroundImage: `url(https://quickchart.io/qr?text=${cloudVideoURL}&size=500)`,
                }}
              />
              <div className='txt'>
                <TweenerProvider
                  initialStyle={{ opacity: 0, y: 50 }}
                  tweenTo={{ opacity: 1, y: 0 }}
                  options={{ duration: 500, delay: 50 }}
                  shouldFadeIn={transition === TransitionType.FadeIn}
                />
                <TweenerProvider
                  initialStyle={{ opacity: 0, y: 50 }}
                  tweenTo={{ opacity: 1, y: 0 }}
                  options={{ duration: 500, delay: 100 }}
                  shouldFadeIn={transition === TransitionType.FadeIn}
                  className='t1'
                />
              </div>
            </div>
            <div>
              <TweenerProvider
                initialStyle={{ opacity: 0, y: 50 }}
                tweenTo={{ opacity: 1, y: 0 }}
                options={{ duration: 500, delay: 300 }}
                shouldFadeIn={transition === TransitionType.FadeIn}
                className='aspect-square h-full w-full rounded-2xl bg-white bg-contain bg-center bg-no-repeat'
                style={{
                  backgroundImage: `url(https://quickchart.io/qr?text=${APP_URI.ios}&size=500)`,
                }}
              />
              <div className='txt'>
                <TweenerProvider
                  initialStyle={{ opacity: 0, y: 50 }}
                  tweenTo={{ opacity: 1, y: 0 }}
                  options={{ duration: 500, delay: 350 }}
                  shouldFadeIn={transition === TransitionType.FadeIn}
                />
                <TweenerProvider
                  initialStyle={{ opacity: 0, y: 50 }}
                  tweenTo={{ opacity: 1, y: 0 }}
                  options={{
                    duration: 500,
                    delay: 400,
                  }}
                  shouldFadeIn={transition === TransitionType.FadeIn}
                  className='t2'
                />
              </div>
            </div>
          </div>
          <div className='welcomeTo'>
            <TweenerProvider
              initialStyle={{ opacity: 0, x: '-200%' }}
              tweenTo={{ opacity: 1, x: '0%' }}
              options={{ duration: 500, delay: 550 }}
              shouldFadeIn={transition === TransitionType.FadeIn}
            />
          </div>
          <div className='countDown animate-fade-in'>
            <CountDown transition={transition} setTransition={setTransition} />
          </div>
        </div>
      </div>
    </OnloadProvider>
  );
});
export default Qrcode;
