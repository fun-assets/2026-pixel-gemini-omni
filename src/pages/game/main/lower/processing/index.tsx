import { memo, useEffect } from 'react';
import './index.less';

const Processing = memo(() => {
  useEffect(() => {}, []);
  return (
    <div className='Processing'>
      <div className='h1' />
      <div className='h2' />
      <div className='bar'>
        <div />
      </div>
    </div>
  );
});
export default Processing;
