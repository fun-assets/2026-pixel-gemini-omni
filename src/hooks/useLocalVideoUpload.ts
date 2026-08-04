import { REST_PATH } from '@/settings/config';
import { Context } from '@/settings/constant';
import { ActionType } from '@/settings/type';
import Fetcher from 'lesca-fetcher';
import { useContext, useState } from 'react';

const useLocalVideoUpload = () => {
  const [, setContext] = useContext(Context);
  const [state, setState] = useState<any | undefined>();
  const fetch = async (argument: { relativePath: string }) => {
    try {
      const respond = (await Fetcher.post(REST_PATH.uploadLocalVideo, argument)) as any;
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
        state: { enabled: true, title: '系統訊息', body: '影片生成失敗，請洽工作人員。' },
      });
    }
  };
  return [state, fetch] as const;
};
export default useLocalVideoUpload;
