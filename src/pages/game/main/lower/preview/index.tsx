import { GameContext, GameLowerStepType } from '@/pages/game/config';
import { memo, useContext, useEffect, useRef } from 'react';
import './index.less';
import { Context } from '@/settings/constant';
import { ActionType } from '@/settings/type';

const Preview = memo(() => {
  const [, setContext] = useContext(Context);
  const [{ videoURL }, setState] = useContext(GameContext);
  const hasTriggeredStart = useRef(false);

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
    setContext({ type: ActionType.LoadingProcess, state: { enabled: true } });
    return () => {
      setContext({ type: ActionType.LoadingProcess, state: { enabled: false } });
    };
  }, []);

  return (
    <div className='Preview'>
      <video
        src={videoURL}
        className='h-full w-full object-cover'
        autoPlay
        muted
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
