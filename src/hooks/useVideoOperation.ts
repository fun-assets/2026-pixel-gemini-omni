import { useState } from 'react';

type TVideoOperationState = {
  res: boolean;
  success?: boolean;
  message?: string;
};

const useVideoOperation = () => {
  const [state, setState] = useState<TVideoOperationState>({ res: false });

  const fetch = async () => {
    setTimeout(() => {
      setState({ res: true });
    }, 3000);
  };

  return [state, fetch] as const;
};
export default useVideoOperation;
