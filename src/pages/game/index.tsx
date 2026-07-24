import Container from '@/components/container';
import { memo, useContext, useState } from 'react';
import { GameContext, GamePagesType, GameState } from './config';
import './index.less';
import Main from './main';
import WebcamPicker from './webcamPicker';

const Router = memo(() => {
  const [state] = useContext(GameContext);

  switch (state.page) {
    default:
    case GamePagesType.webcamPicker:
      return <WebcamPicker />;
    case GamePagesType.game:
      return <Main />;
  }
});

const Game = memo(() => {
  const value = useState(GameState);
  return (
    <GameContext.Provider value={value}>
      <Container>
        <div className='Game'>
          <div className='inner'>
            <Router />
          </div>
        </div>
      </Container>
    </GameContext.Provider>
  );
});
export default Game;
