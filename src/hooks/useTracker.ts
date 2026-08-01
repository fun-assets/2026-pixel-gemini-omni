import { REST_PATH } from '@/settings/config';
import Fetcher from 'lesca-fetcher';
import { useEffect } from 'react';
import { IRespond, SETTING, TType } from '../../setting';

type TArgument = {
  collection: string;
  data: Omit<Extract<TType, { pageName: string }>, 'timestamp' | 'count'>;
};

type TrackerPayload = Omit<Extract<TType, { pageName: string }>, 'timestamp' | 'count'>;

const fetchTracker = async (argument: TArgument) => {
  const respond = (await Fetcher.post(REST_PATH.tracking, argument)) as IRespond;
  console.log(respond);
};

export const track = (data: TrackerPayload) => {
  const collection = SETTING.mongodb[1].collection;
  void fetchTracker({ collection, data });
};

const useTracker = (data: TrackerPayload) => {
  useEffect(() => {
    track(data);
  }, []);
};
export default useTracker;
