import { useContext, useState } from 'react';
import { IRespond } from '../../setting';
import { Context } from '@/settings/constant';
import Fetcher from 'lesca-fetcher';
import { REST_PATH } from '@/settings/config';
import { ActionType, TVideoResponse } from '@/settings/type';

type TArgument = { image: string; prompt: string };

const useGenerateVideo = () => {
  const [, setContext] = useContext(Context);
  const [state, setState] = useState<TVideoResponse | undefined>();

  const fetch = async (argument: TArgument) => {
    setContext({ type: ActionType.LoadingProcess, state: { enabled: true } });
    try {
      const respond = (await Fetcher.post(REST_PATH.generateVideo, argument)) as TVideoResponse;
      console.log(respond);
      if (!respond.res) {
        setContext({
          type: ActionType.Modal,
          state: { enabled: true, title: '系統訊息', body: '影片生成失敗，請洽工作人員。' },
        });
        return;
      }
      setState(respond);
    } catch {
      setContext({
        type: ActionType.Modal,
        state: { enabled: true, title: '系統訊息', body: '影片生成失敗，請洽工作人員。' },
      });
    }

    setContext({ type: ActionType.LoadingProcess, state: { enabled: false } });
  };
  return [state, fetch] as const;
};
export default useGenerateVideo;
