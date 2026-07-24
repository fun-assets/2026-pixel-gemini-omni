import { memo, useEffect } from 'react';

type ColumnsProps = {
  leftNode: React.ReactNode;
  rightNode: React.ReactNode;
};

const Columns = memo(({ leftNode, rightNode }: ColumnsProps) => (
  <div className='flex h-full w-full flex-row gap-[5.5%]'>
    <div className='h-full w-1/2'>{leftNode}</div>
    <div className='h-full w-1/2'>{rightNode}</div>
  </div>
));
export default Columns;
