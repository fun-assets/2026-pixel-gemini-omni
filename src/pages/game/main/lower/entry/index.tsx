import Columns from '@/components/columns';
import { useContext, useEffect, useState } from 'react';
import { GameContext, GameLowerStepType } from '../../../config';
import './index.less';
import { TweenProvider } from 'lesca-use-tween';
import { twMerge } from 'tailwind-merge';

const Intro = () => {
  const [, setState] = useContext(GameContext);
  const [ctaEnd, setCtaEnd] = useState(false);
  return (
    <div className='flex h-full w-full flex-col items-center justify-center pt-[5%]'>
      <div className='flex w-full flex-col items-center'>
        <TweenProvider
          initStyle={{ opacity: 0, y: 50 }}
          options={{ duration: 500, delay: 0 }}
          tweenStyle={{ opacity: 1, y: 0 }}
        >
          <div className='h1' />
        </TweenProvider>
        <TweenProvider
          initStyle={{ opacity: 0, y: 50 }}
          options={{ duration: 500, delay: 100 }}
          tweenStyle={{ opacity: 1, y: 0 }}
        >
          <div className='h2' />
        </TweenProvider>
      </div>
      <div className='mt-[4%] flex w-full justify-center'>
        <TweenProvider
          initStyle={{ opacity: 0, x: -50 }}
          options={{ duration: 500, delay: 1000, onEnd: () => setCtaEnd(true) }}
          tweenStyle={{ opacity: 1, x: 0 }}
        >
          <button
            className='cta'
            onClick={() => setState((S) => ({ ...S, step: GameLowerStepType.chooseStyle }))}
          >
            <div />
            <div className={twMerge(ctaEnd && 'animate-entry')} />
          </button>
        </TweenProvider>
      </div>
      <div className='relative mt-[15%] flex w-full justify-center'>
        <TweenProvider
          initStyle={{ opacity: 0 }}
          options={{ duration: 800, delay: 2500 }}
          tweenStyle={{ opacity: 1 }}
        >
          <div className='description' />
        </TweenProvider>
      </div>
    </div>
  );
};

const Entry = () => {
  const [, setState] = useContext(GameContext);
  useEffect(() => {}, []);
  return (
    <div className='Entry h-full w-full'>
      <Columns leftNode={<div className='mobile' />} rightNode={<Intro />} />
    </div>
  );
};
export default Entry;
