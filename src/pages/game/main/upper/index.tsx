import { memo, useState } from 'react';
import './index.less';
import Processing from '@/components/processing';
import { TransitionType } from '@/settings/type';
import OnloadProvider from 'lesca-react-onload';

const Upper = memo(() => {
  const [transition, setTransition] = useState(TransitionType.Unset);
  return (
    <OnloadProvider onload={() => setTransition(TransitionType.FadeIn)}>
      <div className='Upper'>{transition === TransitionType.Unset && <Processing />}</div>
    </OnloadProvider>
  );
});
export default Upper;
