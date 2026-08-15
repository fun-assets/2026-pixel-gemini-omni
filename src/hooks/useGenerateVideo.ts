import { useContext, useRef, useState } from 'react';
import { Context } from '@/settings/constant';
import Fetcher from 'lesca-fetcher';
import { GameStyles, REST_PATH } from '@/settings/config';
import { ActionType, TVideoResponse } from '@/settings/type';
import { track } from './useTracker';

type TArgument = { image: string; prompt: string; seed?: number };

const useGenerateVideo = () => {
  const [, setContext] = useContext(Context);
  const [state, setState] = useState<TVideoResponse | undefined>();
  const fetchTime = useRef<number>(0);

  const onError = (argument: TArgument) => {
    if (fetchTime.current < 1) {
      fetchTime.current += 1;

      setContext({
        type: ActionType.Modal,
        state: {
          enabled: true,
          title: '',
          body: 'AI靈感發想中，請再試一次',
          label: ['再試一次'],
          onClose: () => {
            fetch(argument);
          },
        },
      });
    } else {
      //
      setContext({
        type: ActionType.Modal,
        state: {
          enabled: true,
          title: '系統訊息',
          body: '暫停服務，請洽門市人員協助狀況排除',
          label: ['非常感謝'],
          onClose: () => {
            setState({
              res: false,
              msg: '請洽人員協助狀況排除',
              data: {
                localPath: '',
                baseLocalPath: '',
                subfolder: '',
                fileName: '',
                filePath: '',
                relativePath: '',
                bytes: 0,
              },
            });
          },
        },
      });
    }
  };

  const fetch = async (argument: TArgument) => {
    try {
      const respond = (await Fetcher.post(REST_PATH.generateVideo, argument)) as TVideoResponse;
      if (respond.res) setState(respond);
      else {
        if (respond.msg.includes('版權')) {
          track({
            pageName: 'Ai生成錯誤',
            type:
              GameStyles.filter((item) => item.prompt === argument.prompt)[0].name || '未知風格',
          });
          setContext({
            type: ActionType.Modal,
            state: {
              enabled: true,
              title: 'Responsible AI Policy Block',
              body: 'AI生成內容違反政策，請換一個風格再試一次',
              label: ['確認'],
              onClose: () => {},
            },
          });
          return;
        }
        onError(argument);
      }
    } catch {
      onError(argument);
    }
  };
  return [state, fetch] as const;
};
export default useGenerateVideo;
