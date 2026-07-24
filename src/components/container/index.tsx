import { IReactProps } from '@/settings/type';
import { memo, useEffect } from 'react';

const Container = memo(({ children }: IReactProps) => {
  useEffect(() => {}, []);
  return (
    <div className='flex w-full items-center justify-center bg-white'>
      <div className='border-base-100 aspect-9/16 h-screen border'>{children}</div>
    </div>
  );
});
export default Container;
