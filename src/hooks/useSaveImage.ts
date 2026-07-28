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
    setContext({ type: ActionType.LoadingProcess, state: { enabled: true } });
    const respond = (await Fetcher.post(REST_PATH.saveImage, argument)) as IRespond;
    setState(respond);
    setContext({ type: ActionType.LoadingProcess, state: { enabled: false } });
  };

  return [state, fetch] as const;
};

export default useSaveImage;
