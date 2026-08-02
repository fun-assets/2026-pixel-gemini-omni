import { IReactProps } from '@/settings/type';
import { memo } from 'react';

const Container = memo(({ children }: IReactProps) => {
  return (
    <div className='flex w-full items-center justify-center bg-white'>
      <div className='safe-vh border-base-100 aspect-9/16 border'>
        <div className='relative h-full w-full'>{children}</div>
      </div>
    </div>
  );
});
export default Container;
