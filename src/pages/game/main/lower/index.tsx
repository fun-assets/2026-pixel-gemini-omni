import useGenerateVideo from '@/hooks/useGenerateVideo';
import useLocalVideoUpload from '@/hooks/useLocalVideoUpload';
import useSaveImage from '@/hooks/useSaveImage';
import { track } from '@/hooks/useTracker';
import useVideoOperation from '@/hooks/useVideoOperation';
import { GameStyles } from '@/settings/config';
import { memo, useContext, useEffect, useMemo } from 'react';
import { GameContext, GameLowerStepType } from '../../config';
import ChooseStyle from './chooseStyle';
import Entry from './entry';
import Error from './error';
import Guide from './guide';
import './index.less';
import Preview from './preview';
import Processing from './processing';
import Qrcode from './qrcode';
import Webcam from './webcam';

const Lower = memo(() => {
  const [state] = useContext(GameContext);

  const [{ resultBase64, styleSelected, readyToGenerateVideo }, setState] = useContext(GameContext);
  const promptText = GameStyles[styleSelected]?.prompt ?? GameStyles[0].prompt;

  const [saveImageResponse, saveImage] = useSaveImage();
  const [videoOperationResponse, videoAIOperationFetch] = useVideoOperation();
  const [videoAIResponse, videoAIFetch] = useGenerateVideo();
  const [videoResponse, uploadLocalVideo] = useLocalVideoUpload();

  useEffect(() => {
    if (videoResponse) {
      setState((S) => ({
        ...S,
        cloudVideoURL: videoResponse.data.url,
        generatedVideo: true,
      }));
    }
  }, [videoResponse]);

  useEffect(() => {
    if (videoAIResponse) {
      if (videoAIResponse.res) {
        setState((S) => ({ ...S, videoURL: videoAIResponse.data.localPath }));
        uploadLocalVideo({ relativePath: videoAIResponse.data.relativePath });
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
            track({ pageName: `generate-ai-${GameStyles[styleSelected].name}`, type: 'ai' });
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
        setState((S) => ({ ...S, generatedVideo: true }));
      } else {
        setState((S) => ({ ...S, step: GameLowerStepType.error }));
      }
    }
  }, [videoOperationResponse]);

  useEffect(() => {
    if (readyToGenerateVideo) {
      if (resultBase64) {
        if (window.location.origin.includes('localhost')) {
          saveImage({ image: resultBase64 });
        } else {
          videoAIOperationFetch();
        }
      }
    }
  }, [resultBase64, readyToGenerateVideo]);

  const page = useMemo(() => {
    switch (state.step) {
      case GameLowerStepType.entry:
        return <Entry />;

      case GameLowerStepType.chooseStyle:
        return <ChooseStyle />;

      case GameLowerStepType.webcam:
        return <Webcam />;

      case GameLowerStepType.processing:
        return <Processing />;

      case GameLowerStepType.preview:
        return <Preview />;

      case GameLowerStepType.error:
        return <Error />;

      case GameLowerStepType.guide:
        return <Guide />;

      case GameLowerStepType.qrcode:
        return <Qrcode />;
    }
  }, [state]);
  return <div className='Lower'>{page}</div>;
});
export default Lower;
