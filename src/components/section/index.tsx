import { IReactProps } from '@/settings/type';
import { memo, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import './index.less';

type TSectionProps = IReactProps & {
  width?: 'w-full' | '70%' | 'flex-1';
  isButton?: boolean;
};

const Section = memo(({ children, width, isButton }: TSectionProps) => {
  const currentWidth = useMemo(() => {
    switch (width) {
      case 'w-full':
        return 'w-full';
      case '70%':
        return 'w-[70%]';
      case 'flex-1':
        return 'flex-1';
      default:
        return 'w-full';
    }
  }, [width]);

  return (
    <div
      className={twMerge(
        `Section`,
        currentWidth,
        isButton ? 'rounded-t-[50px] rounded-bl-[50px]' : 'rounded-[50px]',
      )}
    >
      {children}
    </div>
  );
});
export default Section;
