import { memo, useEffect } from 'react';
import './index.less';

const Lower = memo(() => {
  useEffect(() => {}, []);
  return <div className='Lower'>Lower</div>;
});
export default Lower;
