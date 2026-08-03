import useSaveImage from '@/hooks/useSaveImage';
import { GameContext, GameLowerStepType } from '@/pages/game/config';
import { memo, useContext, useEffect } from 'react';
import './index.less';
import useVideoOperation from '@/hooks/useVideoOperation';
import useTracker from '@/hooks/useTracker';
import useGenerateVideo from '@/hooks/useGenerateVideo';
import { GameStyles } from '@/settings/config';
import useLocalVideoUpload from '@/hooks/useLocalVideoUpload';

const Processing = memo(() => {
  const [{ resultBase64, styleSelected }, setState] = useContext(GameContext);
  const promptText = GameStyles[styleSelected]?.prompt ?? GameStyles[0].prompt;
  const [saveImageResponse, saveImage] = useSaveImage();
  const [videoOperationResponse, videoAIOperationFetch] = useVideoOperation();
  const [videoAIResponse, videoAIFetch] = useGenerateVideo();
  const [videoResponse, uploadLocalVideo] = useLocalVideoUpload();

  useTracker({ pageName: '生成動態中', type: 'pageView' });

  useEffect(() => {
    if (videoResponse) {
      setState((S) => ({
        ...S,
        cloudVideoURL: videoResponse.data.url,
        step: GameLowerStepType.preview,
      }));
    }
  }, [videoResponse]);

  useEffect(() => {
    if (videoAIResponse) {
      if (videoAIResponse.res) {
        setState((S) => ({ ...S, videoURL: videoAIResponse.data.localPath }));
        uploadLocalVideo({ localPath: videoAIResponse.data.localPath });
      }
    }
  }, [videoAIResponse]);

  useEffect(() => {
    if (saveImageResponse) {
      if (saveImageResponse.res && resultBase64) {
        const image = new Image();
        image.onload = () => {
          const imageWidth = image.width;
          if (imageWidth <= 100) {
            videoAIOperationFetch();
          } else {
            videoAIFetch({ image: resultBase64, prompt: promptText });
          }
        };
        image.src = resultBase64;
      } else {
        setState((S) => ({ ...S, step: GameLowerStepType.error }));
      }
    }
  }, [saveImageResponse, resultBase64]);

  useEffect(() => {
    if (videoOperationResponse) {
      if (videoOperationResponse.res) {
        setState((S) => ({ ...S, step: GameLowerStepType.preview }));
      } else {
        setState((S) => ({ ...S, step: GameLowerStepType.error }));
      }
    }
  }, [videoOperationResponse]);

  useEffect(() => {
    if (resultBase64) {
      if (window.location.origin.includes('localhost')) {
        saveImage({ image: resultBase64 });
      } else {
        videoAIOperationFetch();
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
