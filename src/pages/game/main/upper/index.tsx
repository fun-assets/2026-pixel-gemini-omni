import { memo, useState } from 'react';
import './index.less';
import { TransitionType } from '@/settings/type';
import OnloadProvider from 'lesca-react-onload';
import Process from '@/components/processing';

const Upper = memo(() => {
  const [transition, setTransition] = useState(TransitionType.Unset);
  return (
    <OnloadProvider onload={() => setTransition(TransitionType.FadeIn)}>
      <div className='Upper'>{transition === TransitionType.Unset && <Process />}</div>
    </OnloadProvider>
  );
});
export default Upper;
