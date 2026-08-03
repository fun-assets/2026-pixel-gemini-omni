import { REST_PATH } from '@/settings/config';
import Fetcher from 'lesca-fetcher';
import { useContext, useEffect } from 'react';
import { IRespond, SETTING, TType } from '../../setting';
import { Context } from '@/settings/constant';
import { ActionType } from '@/settings/type';

type TArgument = {
  collection: string;
  data: Omit<Extract<TType, { pageName: string }>, 'timestamp' | 'count'>;
};

type TrackerPayload = Omit<Extract<TType, { pageName: string }>, 'timestamp' | 'count'>;

const fetchTracker = async (argument: TArgument) => {
  const respond = (await Fetcher.post(REST_PATH.tracking, argument)) as IRespond;
  return respond;
};

export const track = async (data: TrackerPayload) => {
  const collection = SETTING.mongodb[1].collection;
  const response = await fetchTracker({ collection, data });
  return response;
};

const useTracker = (data: TrackerPayload) => {
  const [, setContext] = useContext(Context);

  useEffect(() => {
    const fetchData = async () => {
      if (!window.location.origin.includes('localhost')) return;
      try {
        const response = await track(data);
        if (response) {
          if (!response.res) {
            setContext({
              type: ActionType.Modal,
              state: { enabled: true, body: '資料庫失效，請洽工作人員。' },
            });
          }
        }
      } catch {
        setContext({
          type: ActionType.Modal,
          state: { enabled: true, title: '系統訊息', body: '資料庫失效，請洽工作人員。' },
        });
      }
    };
    fetchData();
  }, []);
};
export default useTracker;
