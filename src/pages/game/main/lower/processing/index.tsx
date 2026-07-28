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
      } else {
        setState((S) => ({ ...S, step: GameLowerStepType.error }));
      }
    }
  }, [saveImageResponse]);

  useEffect(() => {
    if (videoAIResponse) {
      if (videoAIResponse.res) {
        setState((S) => ({ ...S, step: GameLowerStepType.preview }));
      } else {
        setState((S) => ({ ...S, step: GameLowerStepType.error }));
      }
    }
  }, [videoAIResponse]);

  useEffect(() => {
    if (resultBase64) {
      if (window.location.origin.includes('localhost')) {
        saveImage({ image: resultBase64 });
      } else {
        videoAIFetch();
      }
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
