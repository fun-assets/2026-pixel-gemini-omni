import { memo, useEffect, useState } from 'react';
import './index.less';
import { GameStyles } from '@/pages/game/config';
import { twMerge } from 'tailwind-merge';

type StyleItemProps = {
  data: { name: string; prompt: string };
  index: number;
  styleSelected: number | null;
  setStyleSelected: React.Dispatch<React.SetStateAction<number | null>>;
};

const StyleItem = memo(({ data, index, styleSelected, setStyleSelected }: StyleItemProps) => {
  return (
    <div className='item'>
      <button
        className={twMerge(styleSelected === index ? 'selected' : '')}
        onClick={() => {
          setStyleSelected((prev) => (prev === index ? null : index));
        }}
      >
        <div className={twMerge('cover')}>
          <div className={`style-${index + 1}`} />
        </div>
        <span>{data.name}</span>
      </button>
    </div>
  );
});

const ChooseStyle = memo(() => {
  useEffect(() => {}, []);
  const [styleSelected, setStyleSelected] = useState<number | null>(null);

  useEffect(() => {
    console.log(styleSelected);
  }, [styleSelected]);

  return (
    <div className='ChooseStyle'>
      <div>
        <div className='h1' />
        <div className='h2' />
        <div className='styles'>
          {GameStyles.map((data, index) => (
            <StyleItem
              key={index}
              data={data}
              index={index}
              styleSelected={styleSelected}
              setStyleSelected={setStyleSelected}
            />
          ))}
        </div>
        <div className='productName' />
      </div>
    </div>
  );
});
export default ChooseStyle;
