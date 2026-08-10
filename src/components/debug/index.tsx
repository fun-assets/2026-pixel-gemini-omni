import { GameStyles } from '@/settings/config';
import { Context } from '@/settings/constant';
import { ActionType } from '@/settings/type';
import { memo, useContext, useEffect, useRef, useState } from 'react';

const Keys = [...GameStyles.map((style) => style.name)];

const Debug = memo(() => {
  const [context, setContext] = useContext(Context);
  const seeds = context[ActionType.Seed]!;
  const inputRef = useRef<HTMLInputElement>(null);

  const currentSeed = Keys.map((key) => {
    const seed = seeds?.[key]?.seed;
    if (seed) return { key, seed };
    return { key, seed: '未設定' };
  });

  const [target, setTarget] = useState(Keys[0]);

  const onRandom = () => {
    const seed = Math.floor(Math.random() * 2147483647);
    inputRef.current!.value = String(seed);
  };

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTarget(e.currentTarget.value);
  };

  const onFill = () => {
    const seed = inputRef.current!.value;
    if (seed) {
      setContext({ type: ActionType.Seed, state: { [target]: { seed: Number(seed) } } });
    }
  };

  return (
    <div className='flex h-full w-full flex-col items-center justify-center gap-5 p-10'>
      <div className='join flex w-full justify-center'>
        <div className='flex-1'>
          <div>
            <input
              ref={inputRef}
              className='input join-item input-xl w-full'
              placeholder='請輸入種子'
            />
          </div>
        </div>
        <select className='select select-xl join-item' onChange={onChange}>
          {Keys.map((key) => (
            <option key={key}>{key}</option>
          ))}
        </select>
        <div className='indicator'>
          <button className='btn join-item btn-xl' onClick={onRandom}>
            亂數
          </button>
          <button className='btn join-item btn-xl' onClick={onFill}>
            填入
          </button>
        </div>
      </div>
      <div className='w-full'>
        <div className='overflow-x-auto'>
          <table className='table'>
            <thead>
              <tr>
                <th></th>
                <th>名字</th>
                <th>種子</th>
              </tr>
            </thead>
            <tbody>
              {currentSeed.map((seed, index) => (
                <tr key={seed.key}>
                  <th>{index + 1}</th>
                  <td>{seed.key}</td>
                  <td>{seed.seed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});
export default Debug;
