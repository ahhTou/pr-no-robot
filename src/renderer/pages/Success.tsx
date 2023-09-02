import c from 'classnames';

import '@r/assets/base.css';

const App = () => {
  return (
    <div className={c('h-[100vh] w-[100vw] bg-slate-600 flex flex-col items-center justify-center')}>
      <div className={c('font-extrabold text-4xl text-green-300 mb-6')}>
        <span className={c('text-xs font-normal')}>Not necessarily </span>
        <br />
        Successful
      </div>
      <a
        className={c('text-white cursor-pointer')}
        onClick={() => {
          window.location.href = '/';
        }}
      >
        ← Back
      </a>
    </div>
  );
};

export default App;
