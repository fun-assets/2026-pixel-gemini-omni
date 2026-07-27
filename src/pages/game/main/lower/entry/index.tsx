import Columns from '@/components/columns';
import TweenerProvider from '@/components/tweenProvider';
import { useContext, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { GameContext, GameLowerStepType } from '../../../config';
import './index.less';

const Intro = () => {
  const [, setState] = useContext(GameContext);
  const [ctaEnd, setCtaEnd] = useState(false);
  return (
    <div className='flex h-full w-full flex-col items-center justify-center pt-[5%]'>
      <div className='flex w-full flex-col items-center'>
        <TweenerProvider
          className='flex w-full flex-row justify-center'
          initialStyle={{ opacity: 0, y: 50 }}
          options={{ duration: 500, delay: 0 }}
          tweenTo={{ opacity: 1, y: 0 }}
          shouldFadeIn={true}
        >
          <div className='h1' />
        </TweenerProvider>
        <TweenerProvider
          className='flex w-full flex-row justify-center'
          initialStyle={{ opacity: 0, y: 50 }}
          options={{ duration: 500, delay: 50 }}
          tweenTo={{ opacity: 1, y: 0 }}

          shouldFadeIn
        >
          <div className='h2' />
        </TweenerProvider>
      </div>
      <div className='mt-[4%] flex w-full justify-center'>
        <TweenerProvider
          className='flex w-full justify-center'
          initialStyle={{ opacity: 0, x: -50 }}
          options={{ duration: 500, delay: 400, onEnd: () => setCtaEnd(true) }}
          tweenTo={{ opacity: 1, x: 0 }}
          shouldFadeIn
        >
          <button
            className='cta'
            onClick={() => setState((S) => ({ ...S, step: GameLowerStepType.chooseStyle }))}
          >
            <div />
            <div className={twMerge(ctaEnd && 'animate-entry')} />
          </button>
        </TweenerProvider>
      </div>
      <div className='relative mt-[15%] flex w-full justify-center [&>div]:w-full'>
        <TweenerProvider
          initialStyle={{ opacity: 0 }}
          options={{ duration: 200, delay: 0 }}
          tweenTo={{ opacity: 1 }}
          shouldFadeIn
        >
          <div className='description' />
        </TweenerProvider>
      </div>
    </div>
  );
};

const Entry = () => {
  return (
    <div className='lower-inner'>
      <div className='Entry h-full w-full'>
        <Columns leftNode={<div className='mobile' />} rightNode={<Intro />} />
      </div>
    </div>
  );
};
export default Entry;
