import { memo, useContext } from 'react';
import { GameContext } from '../../../config';
import './index.less';
import Columns from '@/components/columns';

const Webcam = memo(() => {
  const [state] = useContext(GameContext);

  return (
    <div className='Webcam'>
      <Columns leftNode={<></>} rightNode={<></>} />
    </div>
  );
});
export default Webcam;
