import Columns from '@/components/columns';
import { memo, useState } from 'react';
import { GameWebcamStepsContext, GameWebcamStepsState } from './config';
import './index.less';
import Steps from './steps';
import Video from './video/video';

const Webcam = memo(() => {
  const value = useState(GameWebcamStepsState);
  return (
    <div className='Webcam'>
      <GameWebcamStepsContext.Provider value={value}>
        <Columns leftNode={<Video />} rightNode={<Steps />} gap='0' />
      </GameWebcamStepsContext.Provider>
    </div>
  );
});
export default Webcam;
