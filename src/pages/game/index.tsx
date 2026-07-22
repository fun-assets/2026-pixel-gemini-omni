import Blockquote from '@/components/blockquote';
import Section from '@/components/section';
import { memo } from 'react';
import './index.less';
import Medium from './medium';
import Upper from './upper';
import Lower from './lower';

const Game = memo(() => {
  return (
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
  );
});
export default Game;
