import { memo, useEffect } from 'react';
import './index.less';

const Qrcode = memo(() => {
  useEffect(() => {}, []);
  return (
    <div className='Qrcode'>
      <div className='inner'>
        <div className='codes'>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
});
export default Qrcode;
