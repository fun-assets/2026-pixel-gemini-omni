import Container from '@/components/container';
import Sounds from '@/components/sounds';
import { Context } from '@/settings/constant';
import { ActionType } from '@/settings/type';
import { useContext, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { GameContext, GamePagesType, GameState } from './config';
import './index.less';
import Main from './main';
import WebcamPicker from './webcamPicker';

const Router = () => {
  const [state] = useContext(GameContext);

  switch (state.page) {
    default:
    case GamePagesType.webcamPicker:
      return <WebcamPicker />;
    case GamePagesType.game:
      return <Main />;
  }
};

const Game = () => {
  const [, setContext] = useContext(Context);
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const value = useState(GameState);
  const [scale, setScale] = useState(1);
  const [isScaled, setIsScaled] = useState(false);
  const [isRightClickLocked] = useState(true);

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isRightClickLocked) return;
    event.preventDefault();
    event.stopPropagation();
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isRightClickLocked) return;
    if (event.button === 2) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  useEffect(() => {
    const preventDefaultContextMenu = (event: Event) => {
      event.preventDefault();
    };

    const preventDefaultMouseDown = (event: MouseEvent) => {
      if (event.button === 2) {
        event.preventDefault();
      }
    };

    document.addEventListener('contextmenu', preventDefaultContextMenu);
    document.addEventListener('mousedown', preventDefaultMouseDown);

    const innerWidth = 1080;
    const innerHeight = 1920;

    const resize = () => {
      if (innerRef.current && outerRef.current) {
        const { clientWidth: outerWidth, clientHeight: outerHeight } = outerRef.current;
        if (outerWidth === 0 || outerHeight === 0) return;
        const nextScale = Math.min(outerWidth / innerWidth, outerHeight / innerHeight);
        setScale(nextScale);
        setIsScaled(true);
      }
    };

    const observer = new ResizeObserver(resize);
    if (outerRef.current) {
      observer.observe(outerRef.current);
    }

    resize();
    window.addEventListener('resize', resize);
    return () => {
      document.removeEventListener('contextmenu', preventDefaultContextMenu);
      document.removeEventListener('mousedown', preventDefaultMouseDown);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  const onError = (message: string) => {
    setContext({
      type: ActionType.Modal,
      state: {
        enabled: true,
        title: '系統訊息',
        body: message,
        label: ['確定'],
      },
    });
  };

  useEffect(() => {
    const tracks = new Sounds({
      onError,
      onload: () => {},
    });
    tracks.preload('onStart');
    setContext({ type: ActionType.Sounds, state: { tracks } });
  }, []);

  return (
    <GameContext.Provider value={value}>
      <Container>
        <div
          ref={outerRef}
          className='Game'
          onContextMenu={handleContextMenu}
          onMouseDown={handleMouseDown}
        >
          <div
            className={twMerge('inner', isScaled ? 'visible' : 'invisible')}
            ref={innerRef}
            style={{ transform: `scale(${scale})` }}
          >
            <Router />
          </div>
        </div>
      </Container>
    </GameContext.Provider>
  );
};
export default Game;
