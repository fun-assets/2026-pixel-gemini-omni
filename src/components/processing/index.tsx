import { LoadingProcessType } from '@/settings/type';
import { memo } from 'react';
import { LoadingSvg } from '../loadingProcess';
import './index.less';

const Process = memo(() => {
  return (
    <div className='Process'>
      <LoadingSvg className='relative' type={LoadingProcessType.Bars} />
    </div>
  );
});
export default Process;
