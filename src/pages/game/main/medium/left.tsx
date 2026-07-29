import { TransitionType } from '@/settings/type';
import OnloadProvider from 'lesca-react-onload';
import { memo, useState } from 'react';
import Process from '@/components/processing';

const MediumLeft = memo(() => {
  const [transition, setTransition] = useState(TransitionType.Unset);
  return (
    <OnloadProvider onload={() => setTransition(TransitionType.FadeIn)}>
      <div className='MediumLeft'>{transition === TransitionType.Unset && <Process />}</div>
    </OnloadProvider>
  );
});
export default MediumLeft;
