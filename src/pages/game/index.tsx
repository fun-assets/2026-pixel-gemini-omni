import Container from '@/components/container';
import { useContext, useEffect, useRef, useState } from 'react';
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
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const value = useState(GameState);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const innerWidth = 1080;
    const innerHeight = 1920;

    const resize = () => {
      if (innerRef.current && outerRef.current) {
        const { clientWidth: outerWidth, clientHeight: outerHeight } = outerRef.current;
        if (outerWidth === 0 || outerHeight === 0) return;
        const nextScale = Math.min(outerWidth / innerWidth, outerHeight / innerHeight);
        setScale(nextScale);
      }
    };

    const observer = new ResizeObserver(resize);
    if (outerRef.current) {
      observer.observe(outerRef.current);
    }

    resize();
    window.addEventListener('resize', resize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);
  return (
    <GameContext.Provider value={value}>
      <Container>
        <div ref={outerRef} className='Game'>
          <div className='inner' ref={innerRef} style={{ transform: `scale(${scale})` }}>
            <Router />
          </div>
        </div>
      </Container>
    </GameContext.Provider>
  );
};
export default Game;
