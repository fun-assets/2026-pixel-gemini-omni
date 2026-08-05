import LiquidGlassButton from '@/components/LiquidGlassButton';
import { memo, useEffect } from 'react';
import './index.less';
import { downloadMobileMp4 } from './misc';
import QueryString from 'lesca-url-parameters';

const Download = memo(() => {
  useEffect(() => {}, []);
  const videoURL = QueryString.get('uri');
  return (
    <div className='Download min-h-screen'>
      {videoURL ? (
        <>
          <div className='aspect-9/16 h-[70%] w-auto bg-gray-900'>
            <div className='block h-full w-auto max-w-full object-cover object-center'>
              <video
                src={videoURL}
                className='h-full w-full object-cover'
                loop
                playsInline
                controls
              />
            </div>
          </div>

          <div className='relative mb-10 w-9/12'></div>
          <LiquidGlassButton
            shape='pill'
            className='text-black'
            size={40}
            width={250}
            wobbleAmount={0.05}
            wobbleSpeed={2}
            shadow
            blur={0}
            tint={0}
            onClick={() => downloadMobileMp4(`${videoURL}?download=1`, 'google-pixel-11.mp4')}
          >
            <span className='text-white'>下載 / Download</span>
          </LiquidGlassButton>
        </>
      ) : (
        <span>網路影片無法下載，請洽服務人員</span>
      )}
    </div>
  );
});
export default Download;
