import { GameContext, GameLowerStepType } from '@/pages/game/config';
import { memo, useContext, useEffect, useRef } from 'react';
import './index.less';
import { Context } from '@/settings/constant';
import { ActionType } from '@/settings/type';
import useTracker from '@/hooks/useTracker';

const Preview = memo(() => {
  const [context, setContext] = useContext(Context);
  const { tracks } = context[ActionType.Sounds]!;
  const [{ videoURL }, setState] = useContext(GameContext);
  const hasTriggeredStart = useRef(false);

  useTracker({ pageName: '預覽成品', type: 'pageView' });

  useEffect(() => {
    hasTriggeredStart.current = false;
    setContext({ type: ActionType.LoadingProcess, state: { enabled: true } });
  }, [videoURL]);

  const handleVideoStart = () => {
    if (hasTriggeredStart.current) {
      return;
    }
    hasTriggeredStart.current = true;
    setContext({ type: ActionType.LoadingProcess, state: { enabled: false } });
  };

  useEffect(() => {
    tracks?.pause('bgm');
    setContext({ type: ActionType.LoadingProcess, state: { enabled: true } });
    return () => {
      setContext({ type: ActionType.LoadingProcess, state: { enabled: false } });
      tracks?.play('bgm', 1, false);
    };
  }, []);

  return (
    <div className='Preview'>
      <video
        src={videoURL}
        className='h-full w-full object-cover'
        autoPlay
        playsInline
        onPlay={handleVideoStart}
        onTimeUpdate={({ currentTarget }) => {
          const isPlaying = !currentTarget.paused && !currentTarget.ended;
          if (isPlaying) {
            handleVideoStart();
          }
        }}
        onEnded={() => setState((S) => ({ ...S, step: GameLowerStepType.guide }))}
      />
    </div>
  );
});
export default Preview;
