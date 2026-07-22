import { memo, useEffect } from 'react';
import './index.less';
import Webcam from './webcam';

const Lower = memo(() => {
  useEffect(() => {}, []);
  return (
    <div className='Lower'>
      <Webcam />
    </div>
  );
});
export default Lower;
