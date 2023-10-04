import c from 'classnames';
import { useState } from 'react';

import '@r/assets/base.css';
import Statistics from '@r/components/Statistics';

const App = () => {
  const [id, setID] = useState('');
  const [statisticsVisible, setStatisticsVisible] = useState<boolean>();

  const handleGo = () => {
    window.location.href = `/pr/${id}`;
  };

  return (
    <div className={c('h-[100vh] w-[100vw] bg-slate-600 flex flex-col items-center justify-center')}>
      <div className={c('font-extrabold text-4xl text-white italic mb-6')}>PR No Robot</div>

      <div className={c('flex items-center')}>
        <input
          value={id}
          onChange={(ev) => setID(ev.target.value)}
          className={c(
            'mr-1 text-gray-400 w-40 py-1 px-2 text-xl bg-transparent outline-none border-b border-solid border-gray-200'
          )}
          placeholder="Your PR id"
        />
        <button
          className={c(
            'bg-slate-400 text-white opacity-20 transition-all hover:opacity-100 rounded-full w-[30px] h-[30px]'
          )}
          onClick={handleGo}
        >
          →
        </button>
      </div>

      <div
        className={c('animate-pulse bottom-4 absolute m-auto text-gray-400 hover:opacity-60 cursor-pointer transition-all')}
        onClick={() => {
          setStatisticsVisible((s) => !s);
        }}
      >
        Statistics
      </div>

      {statisticsVisible && (
        <Statistics
          onClose={() => {
            setStatisticsVisible(false);
          }}
        />
      )}
    </div>
  );
};

export default App;
