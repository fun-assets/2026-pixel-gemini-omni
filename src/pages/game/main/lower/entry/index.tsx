import { memo, useContext, useEffect } from 'react';
import './index.less';
import { GameContext, GameLowerStepType } from '../../../config';
import Columns from '@/components/columns';

const Entry = memo(() => {
  const [, setState] = useContext(GameContext);
  useEffect(() => {}, []);
  return (
    <div className='Entry h-full w-full'>
      <Columns leftNode={<div className='mobile' />} rightNode={<div>Right Content</div>} />
    </div>
  );
});
export default Entry;
