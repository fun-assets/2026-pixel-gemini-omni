import { useContext, useRef, useState } from 'react';
import { Context } from '@/settings/constant';
import Fetcher from 'lesca-fetcher';
import { REST_PATH } from '@/settings/config';
import { ActionType, TVideoResponse } from '@/settings/type';

type TArgument = { image: string; prompt: string };

const useGenerateVideo = () => {
  const [, setContext] = useContext(Context);
  const [state, setState] = useState<TVideoResponse | undefined>();
  const fetchTime = useRef<number>(0);

  const fetch = async (argument: TArgument) => {
    try {
      const respond = (await Fetcher.post(REST_PATH.generateVideo, argument)) as TVideoResponse;
      if (respond.res) setState(respond);
      else {
        setContext({
          type: ActionType.Modal,
          state: { enabled: true, title: '系統訊息', body: respond.msg },
        });
      }
    } catch {
      setContext({
        type: ActionType.Modal,
        state: {
          enabled: true,
          title: '系統訊息',
          body: '影片生成失敗，請洽工作人員。',
          label: ['再試一次'],
          onClose: () => {
            if (fetchTime.current < 3) {
              fetchTime.current += 1;
              fetch(argument);
            } else {
              //
            }
          },
        },
      });
    }
  };
  return [state, fetch] as const;
};
export default useGenerateVideo;
