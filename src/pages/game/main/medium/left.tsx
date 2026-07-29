import { TransitionType } from '@/settings/type';
import OnloadProvider from 'lesca-react-onload';
import { memo, useState } from 'react';
import Processing from '../lower/processing';

const MediumLeft = memo(() => {
  const [transition, setTransition] = useState(TransitionType.Unset);
  return (
    <OnloadProvider onload={() => setTransition(TransitionType.FadeIn)}>
      <div className='MediumLeft'>{transition === TransitionType.Unset && <Processing />}</div>
    </OnloadProvider>
  );
});
export default MediumLeft;
