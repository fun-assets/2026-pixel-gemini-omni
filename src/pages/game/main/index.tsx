import Blockquote from '@/components/blockquote';
import Section from '@/components/section';
import { useEffect } from 'react';
import Lower from './lower';
import Medium from './medium';
import Upper from './upper';
import './index.less';

const Main = () => {
  useEffect(() => {}, []);
  return (
    <div className='Main'>
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
  );
};
export default Main;
