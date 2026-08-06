import useTween, { Bezier } from 'lesca-use-tween';
import { memo, useContext, useEffect, useState } from 'react';
import './index.less';
import { GameWebcamStepsContext, GameWebcamStepsStepType } from '../../config';
import { GameContext } from '@/pages/game/config';
import { Context } from '@/settings/constant';
import { ActionType } from '@/settings/type';

const Num = memo(({ index, idx }: { index: number; idx: number }) => {
  const [context] = useContext(Context);
  const { tracks } = context[ActionType.Sounds]!;

  const [{ capture }] = useContext(GameContext);
  const [, setState] = useContext(GameWebcamStepsContext);
  const [style, setStyle] = useTween({ opacity: 0, scale: 3 });
  useEffect(() => {
    if (index === idx) {
      setStyle(
        { opacity: 1, scale: 1.2 },
        {
          duration: 200,
          easing: Bezier.outQuart,
          onStart: () => {
            tracks?.play('countdown');
          },
          onEnd: () => {
            setStyle(
              { opacity: 1, scale: 1 },
              {
                duration: 600,
                easing: Bezier.linear,
                onEnd: () => {
                  setStyle(
                    { opacity: 0, scale: 0 },
                    {
                      duration: 200,
                      easing: Bezier.inQuart,
                      onEnd: () => {
                        if (index === 3) {
                          capture?.();
                          setState((S) => ({
                            ...S,
                            step: GameWebcamStepsStepType.captureAndConfirm,
                          }));
                          tracks?.play('camera');
                          tracks?.stop('countdown');
                        }
                      },
                    },
                  );
                },
              },
            );
          },
        },
      );
    }
    return () => {
      tracks?.stop('countdown');
    };
  }, [index, idx]);
  return <div className={`n${index}`} style={style} />;
});

const CountDown = memo(() => {
  const [idx, setIdx] = useState(0);
  const [, setTransform] = useTween({ x: 0 });

  useEffect(() => {
    setTransform(
      { x: 3 },
      {
        duration: 3000,
        easing: Bezier.linear,
        onUpdate: (v: { x: number }) => {
          const i = Math.floor(v.x);
          setIdx(i);
        },
        onEnd: (v: { x: number }) => {
          const i = Math.floor(v.x);
          setIdx(i);
        },
      },
    );
  }, []);

  return (
    <div className='CountDown'>
      {[...new Array(3).keys()].map((i) => (
        <Num index={i + 1} key={i} idx={idx} />
      ))}
    </div>
  );
});
export default CountDown;
