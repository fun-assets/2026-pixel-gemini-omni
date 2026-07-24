import { memo } from 'react';
import { twMerge } from 'tailwind-merge';

type ColumnsProps = {
  leftNode: React.ReactNode;
  rightNode: React.ReactNode;
  gap?: string;
};

const Columns = memo(({ leftNode, rightNode, gap }: ColumnsProps) => (
  <div className={twMerge('flex h-full w-full flex-row', gap ? `gap-[${gap}]` : 'gap-[5.5%]')}>
    <div className={twMerge('h-full', gap === '0' ? 'w-[44.5%]' : 'w-1/2')}>{leftNode}</div>
    <div className='h-full flex-1'>{rightNode}</div>
  </div>
));
export default Columns;
