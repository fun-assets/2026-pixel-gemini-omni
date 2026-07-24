import Blockquote from '@/components/blockquote';
import Section from '@/components/section';
import { memo, useState } from 'react';
import { GameContext, GameState } from './config';
import './index.less';
import Lower from './lower';
import Medium from './medium';
import Upper from './upper';
import Container from '@/components/container';

const Game = memo(() => {
  const value = useState(GameState);
  return (
    <GameContext.Provider value={value}>
      <Container>
        <div className='Game'>
          <div className='inner'>
            <Blockquote height='upper'>
              <Section width='w-full'>
                <Upper />
              </Section>
            </Blockquote>
            <Blockquote height='medium'>
              <Section width='70%'>
                <Medium.Left />
              </Section>
              <Section width='flex-1'>
                <Medium.Right />
              </Section>
            </Blockquote>
            <Blockquote height='lower'>
              <Section width='w-full'>
                <Lower />
              </Section>
            </Blockquote>
          </div>
        </div>
      </Container>
    </GameContext.Provider>
  );
});
export default Game;
