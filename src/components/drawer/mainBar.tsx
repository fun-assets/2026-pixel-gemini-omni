import { memo } from 'react';
import { BiSolidPhotoAlbum } from 'react-icons/bi';
import { BsTools } from 'react-icons/bs';
import { Link } from 'react-router-dom';

// TODO: add type for collection
const MainBar = memo(() => (
  <ul className='menu text-base-content relative min-h-full w-80 p-4 select-none'>
    <div className='flex w-full flex-row items-center justify-start pb-5'>
      <BsTools className='mr-1' />
      TOOLS
    </div>
    <li>
      <Link to='/album'>
        <BiSolidPhotoAlbum />
        Album
      </Link>
    </li>
  </ul>
));
export default MainBar;
