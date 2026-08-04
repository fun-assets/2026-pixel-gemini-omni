import LiquidGlassButton from '@/components/LiquidGlassButton';
import { APP_URI } from '@/settings/config';
import UserAgent from 'lesca-user-agent';
import { memo } from 'react';
import appImage from './img/unnamed.webp';

const Apps = memo(() => {
  const onClick = () => {
    if (UserAgent.android()) {
      window.open(APP_URI.android, '_blank');
    } else if (UserAgent.ios()) {
      window.open(APP_URI.ios, '_blank');
    }
  };
  return (
    <div className='flex h-full w-full flex-col items-center justify-center gap-4'>
      <div className='card bg-canyon-medium w-96 shadow-sm'>
        <figure className='px-10 pt-10'>
          <img src={appImage} alt='Google Gemini' className='rounded-xl' />
        </figure>
        <div className='card-body items-center text-center'>
          <h2 className='card-title'>Google Gemini</h2>
          <p>
            Google Gemini 功能強大，是你最貼心的 AI
            助理：早上通勤，或是深夜鑽研感興趣的主題，你都能獲得協助。
          </p>
          <div className='card-actions'>
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
              onClick={onClick}
            >
              <span className='text-white'>下載 / Download</span>
            </LiquidGlassButton>
          </div>
        </div>
      </div>
    </div>
  );
});
export default Apps;
