import { memo, useEffect } from 'react';
import './index.less';

const Prompt = memo(() => {
  useEffect(() => {}, []);
  return (
    <div className='Prompt'>
      <div className='dialog'>
        <div>描述影片構想</div>
        <div>
          <div className='menu'>
            <div className='add' />
            <div className='type' />
          </div>
          <div className='mic' />
        </div>
      </div>
    </div>
  );
});
export default Prompt;
