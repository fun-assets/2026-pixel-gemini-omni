import { memo, useState } from 'react';
import './index.less';
import { TransitionType } from '@/settings/type';
import OnloadProvider from 'lesca-react-onload';
import Process from '@/components/processing';
import QueryString from 'lesca-url-parameters';
import Debug from '@/components/debug';

const Upper = memo(() => {
  const [transition, setTransition] = useState(TransitionType.Unset);
  const search = QueryString.get('debug');

  return (
    <OnloadProvider onload={() => setTransition(TransitionType.FadeIn)}>
      <div className='Upper'>
        <div className='h-full w-full overflow-hidden rounded-xl'>
          {search === '1' ? (
            <Debug />
          ) : (
            <video
              muted
              playsInline
              loop
              autoPlay
              src='videos/upper.mp4'
              className='h-full w-full object-cover'
            />
          )}
        </div>

        {transition === TransitionType.Unset && <Process />}
      </div>
    </OnloadProvider>
  );
});
export default Upper;
