import Fetcher from 'lesca-fetcher';
import { memo, useState } from 'react';
import { REST_PATH } from '@/settings/config';
import './index.less';

type TVideoOperationData = {
  done?: boolean;
  operation?: Record<string, unknown>;
  video?: {
    uri?: string;
  } | null;
};

type TApiRespond = {
  res: boolean;
  msg: string;
  data?: TVideoOperationData;
};

const Game = memo(() => {
  const [prompt, setPrompt] = useState('Animate this image into a 5-second cinematic shot.');
  const [status, setStatus] = useState('Idle');
  const [videoUrl, setVideoUrl] = useState('');

  const startWebcam = () => {
    // start webcam
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = document.getElementById('webcam') as HTMLVideoElement;
        if (!video) {
          return;
        }

        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play().catch((err) => {
            console.error('Error playing webcam stream: ', err);
          });
        };
      })
      .catch((err) => {
        console.error('Error accessing webcam: ', err);
      });
  };

  const pollOperation = async (operation: Record<string, unknown>) => {
    let currentOperation = operation;
    const maxAttempts = 60;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      setStatus(`Generating video... (${attempt}/${maxAttempts})`);

      const respond = (await Fetcher.post(REST_PATH.getVideoOperation, {
        operation: currentOperation,
      })) as TApiRespond;

      if (!respond?.res || !respond.data) {
        throw new Error(respond?.msg || 'Failed to get operation status');
      }

      currentOperation = respond.data.operation || currentOperation;

      if (respond.data.done) {
        const uri = respond.data.video?.uri;
        if (!uri) {
          throw new Error('Video generation finished, but no video URI returned');
        }
        setVideoUrl(uri);
        setStatus('Video ready');
        return;
      }

      await new Promise((resolve) => {
        setTimeout(resolve, 3000);
      });
    }

    throw new Error('Video generation timeout. Please try again.');
  };

  const onCapture = async () => {
    const video = document.getElementById('webcam') as HTMLVideoElement;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      console.error('Webcam is not ready yet. Please wait a moment and try again.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');
      const capturedImage = document.getElementById('captured-image') as HTMLImageElement;
      if (capturedImage) {
        capturedImage.src = imageData;
      }

      try {
        setVideoUrl('');
        setStatus('Creating video task...');

        const respond = (await Fetcher.post(REST_PATH.generateVideo, {
          image: imageData,
          prompt,
        })) as TApiRespond;
        console.log(respond);

        if (!respond?.res || !respond.data?.operation) {
          throw new Error(respond?.msg || 'Failed to create video task');
        }

        await pollOperation(respond.data.operation);
      } catch (error) {
        console.error(error);
        setStatus(error instanceof Error ? error.message : 'Generate video failed');
      }
    }
  };

  return (
    <div className='Game'>
      <video id='webcam' autoPlay playsInline muted></video>
      <img id='captured-image' alt='Captured' />
      <textarea
        className='textarea textarea-bordered mt-4 w-full max-w-xl'
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder='Describe the motion you want in the generated video'
      />
      <p>{status}</p>
      {videoUrl && (
        <video controls src={videoUrl} style={{ width: '100%', maxWidth: 520 }}>
          <track kind='captions' />
        </video>
      )}
      <div className='join'>
        <button onClick={startWebcam} className='btn join-item'>
          start webcam
        </button>
        <button onClick={onCapture} className='btn join-item'>
          capture
        </button>
      </div>
    </div>
  );
});
export default Game;
