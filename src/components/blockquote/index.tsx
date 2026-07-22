import { IReactProps } from '@/settings/type';
import { memo, useMemo } from 'react';
import './index.less';
import { twMerge } from 'tailwind-merge';

type TBlockquoteProps = IReactProps & {
  height?: 'upper' | 'medium' | 'lower';
};

const Blockquote = memo(({ children, height }: TBlockquoteProps) => {
  const currentHeight = useMemo(() => {
    switch (height) {
      case 'upper':
        return 'h-upper';
      case 'medium':
        return 'h-[var(--height-medium)]';
      case 'lower':
        return 'flex-1';
      default:
        return 'h-auto';
    }
  }, [height]);
  return <div className={twMerge(`Blockquote`, currentHeight)}>{children}</div>;
});
export default Blockquote;
