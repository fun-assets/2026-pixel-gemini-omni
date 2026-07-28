import TweenerProvider from '@/components/tweenProvider';
import { TransitionType } from '@/settings/type';
import OnloadProvider from 'lesca-react-onload';
import { memo, useState } from 'react';
import './index.less';

const Error = memo(() => {
  const [transition, setTransition] = useState(TransitionType.Unset);

  return (
    <OnloadProvider onload={() => setTransition(TransitionType.FadeIn)}>
      <div className='Error'>
        <TweenerProvider
          className='flex w-full justify-center'
          initialStyle={{ opacity: 0, y: 50 }}
          tweenTo={{ opacity: 1, y: 0 }}
          options={{ duration: 500, delay: 300 }}
          shouldFadeIn={transition === TransitionType.FadeIn}
        >
          <div className='h1' />
        </TweenerProvider>
        <TweenerProvider
          className='absolute flex h-full w-full justify-center'
          initialStyle={{ opacity: 0 }}
          tweenTo={{ opacity: 1 }}
          options={{ duration: 500 }}
          shouldFadeIn={transition === TransitionType.FadeIn}
        >
          <div className='logo' />
        </TweenerProvider>
      </div>
    </OnloadProvider>
  );
});
export default Error;
