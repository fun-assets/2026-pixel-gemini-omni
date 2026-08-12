import { REST_PATH } from '@/settings/config';
import { Context } from '@/settings/constant';
import { ActionType } from '@/settings/type';
import Fetcher from 'lesca-fetcher';
import { useContext, useState } from 'react';
import { IRespond } from '../../setting';

type TArgument = { image: string };

const useSaveImage = () => {
  const [, setContext] = useContext(Context);
  const [state, setState] = useState<IRespond | undefined>();

  const fetch = async (argument: TArgument) => {
    try {
      const respond = (await Fetcher.post(REST_PATH.saveImage, argument)) as IRespond;
      if (!respond.res) {
        setContext({
          type: ActionType.Modal,
          state: { enabled: true, title: '系統訊息', body: '圖片儲存失敗，請洽工作人員。' },
        });
        return;
      }
      setState(respond);
    } catch {
      setContext({
        type: ActionType.Modal,
        state: { enabled: true, title: '系統訊息', body: '圖片儲存失敗，請洽工作人員。' },
      });
    }
  };

  return [state, fetch] as const;
};

export default useSaveImage;
