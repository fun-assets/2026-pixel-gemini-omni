import useGenerateVideo from '@/hooks/useGenerateVideo';
import useLocalVideoUpload from '@/hooks/useLocalVideoUpload';
import useSaveImage from '@/hooks/useSaveImage';
import { track } from '@/hooks/useTracker';
import useVideoOperation from '@/hooks/useVideoOperation';
import { GameStyles } from '@/settings/config';
import { memo, useContext, useEffect, useMemo, useRef } from 'react';
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
import { shutdownWebcam } from './webcam/misc';
import { Context } from '@/settings/constant';
import { ActionType } from '@/settings/type';

const Lower = memo(() => {
  const [context] = useContext(Context);
  const seeds = context[ActionType.Seed]!;

  const [{ step, resultBase64, styleSelected, readyToGenerateVideo }, setState] =
    useContext(GameContext);
  const promptText = GameStyles[styleSelected]?.prompt ?? GameStyles[0].prompt;
  const currentName = GameStyles[styleSelected]?.name ?? GameStyles[0].name;

  const [saveImageResponse, saveImage] = useSaveImage();
  const [videoOperationResponse, videoAIOperationFetch] = useVideoOperation();
  const [videoAIResponse, videoAIFetch] = useGenerateVideo();
  const [videoResponse, uploadLocalVideo] = useLocalVideoUpload();
  const waitingSaveImageResponseRef = useRef(false);

  // Webcam only exists during the webcam step; Lower outlives it, so the release
  // has to live here. Video's own unmount cleanup would never see the new step.
  useEffect(() => {
    if (step === GameLowerStepType.webcam) return;
    shutdownWebcam();
  }, [step]);

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
      } else {
        if (videoAIResponse.msg.includes('版權')) {
          setState((S) => ({ ...S, step: GameLowerStepType.entry }));
        } else {
          setState((S) => ({ ...S, step: GameLowerStepType.error }));
        }
      }
    }
  }, [videoAIResponse]);

  useEffect(() => {
    if (!waitingSaveImageResponseRef.current) {
      return;
    }

    if (saveImageResponse) {
      waitingSaveImageResponseRef.current = false;
      if (saveImageResponse.res && resultBase64) {
        const image = new Image();
        image.onload = () => {
          const imageWidth = image.width;
          if (imageWidth <= 100) {
            videoAIOperationFetch();
          } else {
            const seed = seeds[currentName]?.seed ?? undefined;
            videoAIFetch({ image: resultBase64, prompt: promptText, seed });
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
          waitingSaveImageResponseRef.current = true;
          saveImage({ image: resultBase64 });
        } else {
          videoAIOperationFetch();
        }
      }
    }
  }, [resultBase64, readyToGenerateVideo]);

  const page = useMemo(() => {
    switch (step) {
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
  }, [step]);
  return <div className='Lower'>{page}</div>;
});
export default Lower;
