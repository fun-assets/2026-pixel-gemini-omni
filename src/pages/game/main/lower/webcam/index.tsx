import { memo, useContext } from 'react';
import { GameContext } from '../../../config';
import './index.less';
import Columns from '@/components/columns';
import Video from './video';

const Webcam = memo(() => {
  const [state] = useContext(GameContext);

  return (
    <div className='Webcam'>
      <Columns leftNode={<Video />} rightNode={<div className='w-full'>asd</div>} />
    </div>
  );
});
export default Webcam;
