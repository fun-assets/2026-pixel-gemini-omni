import { IReactProps } from '@/settings/type';
import useTween from 'lesca-use-tween';
import { CSSProperties, memo, useEffect } from 'react';

interface CSS extends Omit<CSSProperties, 'rotate'> {
  x?: string | number;
  y?: string | number;
  scale?: string | number;
  rotate?: string | number;
  rotateY?: string | number;
  rotateX?: string | number;
  rotateZ?: string | number;
  skewX?: string | number;
  skewY?: string | number;
}

export type Options = {
  duration?: number;
  easing?: number[];
  delay?: number;
  onStart?: () => void;
  onUpdate?: () => void;
  onEnd?: () => void;
};

type TTweenerProvider = IReactProps & {
  className?: string;
  initialStyle: CSS;
  tweenTo: CSS;
  fadeOutStyle?: CSS;
  options?: Options;
  optionsFadeOut?: Options;
  shouldFadeIn: boolean;
  shouldFadeOut?: boolean;
  needSetCSSAfterFadeOut?: boolean;
  cssAfterFadeOut?: CSS | null;
};

// 這個組件是管理動畫的組件
/** 動畫緩動 Provider，封裝 lesca-use-tween，依 from/to 狀態自動觸發 CSS 屬性過場動畫 */
const TweenerProvider = memo((props: TTweenerProvider) => {
  const { children, initialStyle, tweenTo, options, shouldFadeIn } = props;
  const { fadeOutStyle, optionsFadeOut, shouldFadeOut } = props;
  const [style, setStyle, destroy] = useTween(initialStyle);

  useEffect(() => {
    if (shouldFadeIn) setStyle(tweenTo, { ...options });
    return () => destroy();
  }, [shouldFadeIn]);

  useEffect(() => {
    if (shouldFadeOut && fadeOutStyle)
      setStyle(fadeOutStyle, {
        ...optionsFadeOut,
        onEnd: () => {
          optionsFadeOut?.onEnd?.();
          if (props.needSetCSSAfterFadeOut && props.cssAfterFadeOut) {
            setStyle(props.cssAfterFadeOut, 1);
          }
        },
      });
  }, [shouldFadeOut]);

  return (
    <div className={props.className} style={style}>
      {children}
    </div>
  );
});
export default TweenerProvider;
