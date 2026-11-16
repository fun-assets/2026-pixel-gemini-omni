import { Context } from '@/settings/constant';
import { ActionType } from '@/settings/type';
import { memo, useContext, useEffect, useRef, useState } from 'react';

type TProps = {
  /** 要顯示的訊息內容 */
  body: string;
  /** 倒數秒數，數完自動關閉 Modal */
  seconds: number;
};

/**
 * 放進 Modal body 的訊息元件，自帶倒數秒數並在倒數結束後自動關閉 Modal。
 * 不動共用 Modal 元件，所以只有帶這個 body 的彈窗會自動關閉。
 */
const CountdownMessage = memo(({ body, seconds }: TProps) => {
  const [, setContext] = useContext(Context);
  const [secondsLeft, setSecondsLeft] = useState(seconds);
  const secondsLeftRef = useRef(seconds);

  useEffect(() => {
    const timer = setInterval(() => {
      secondsLeftRef.current -= 1;
      setSecondsLeft(secondsLeftRef.current);

      if (secondsLeftRef.current <= 0) {
        clearInterval(timer);
        setContext({ type: ActionType.Modal, state: { enabled: false } });
      }
    }, 1000);

    // 使用者自己按確認或關掉彈窗時，元件會被卸載，這裡要把計時器收掉
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <div>{body}</div>
      <div className='mt-3 text-sm opacity-60'>{secondsLeft} 秒後自動關閉</div>
    </div>
  );
});
export default CountdownMessage;
