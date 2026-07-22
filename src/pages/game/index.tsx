import { memo } from 'react';
import './index.less';
import Blockquote from '@/components/blockquote';
import Section from '@/components/section';

const Game = memo(() => {
  return (
    <div className='Game'>
      <div className='inner'>
        <Blockquote height='upper'>
          <Section width='w-full'></Section>
        </Blockquote>
      </div>
    </div>
  );
});
export default Game;
