import useSaveImage from '@/hooks/useSaveImage';
import { GameContext, GameLowerStepType } from '@/pages/game/config';
import { memo, useContext, useEffect } from 'react';
import './index.less';
import useVideoOperation from '@/hooks/useVideoOperation';

const Processing = memo(() => {
  const [{ resultBase64 }, setState] = useContext(GameContext);
  const [saveImageResponse, saveImage] = useSaveImage();
  const [videoAIResponse, videoAIFetch] = useVideoOperation();

  useEffect(() => {
    if (saveImageResponse) {
      if (saveImageResponse.res) {
        videoAIFetch();
      }
    }
  }, [saveImageResponse]);

  useEffect(() => {
    if (videoAIResponse) {
      if (videoAIResponse.res) {
        console.log('a');

        setState((S) => ({ ...S, step: GameLowerStepType.result }));
      }
    }
  }, [videoAIResponse]);

  useEffect(() => {
    if (resultBase64) {
      saveImage({ image: resultBase64 });
    }
  }, [resultBase64]);

  return (
    <div className='Processing'>
      <div className='h1' />
      <div className='h2' />
      <div className='bar'>
        <div />
      </div>
    </div>
  );
});
export default Processing;
