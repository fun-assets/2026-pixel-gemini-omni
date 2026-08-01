import { REST_PATH } from '@/settings/config';
import Fetcher from 'lesca-fetcher';
import { useEffect } from 'react';
import { IRespond, SETTING, TType } from '../../setting';

type TArgument = {
  collection: string;
  data: Omit<Extract<TType, { pageName: string }>, 'timestamp' | 'count'>;
};

const useTracker = (data: Omit<Extract<TType, { pageName: string }>, 'timestamp' | 'count'>) => {
  const fetch = async (argument: TArgument) => {
    const respond = (await Fetcher.post(REST_PATH.tracking, argument)) as IRespond;
    console.log(respond);
  };

  useEffect(() => {
    const collection = SETTING.mongodb[1].collection;
    fetch({ collection, data });
  }, []);
};
export default useTracker;
