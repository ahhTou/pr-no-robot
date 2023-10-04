import request from '@r/utils/request';
import useMount from 'ahooks/lib/useMount';
import c from 'classnames';
import sortBy from 'lodash/sortBy';
import unionBy from 'lodash/unionBy';
import { useState } from 'react';

import type { Log } from 'src/main/store';

type OneStatistic = {
  username: string;
  count: number;
  ratio: number;
};

const Statistics = (props: { onClose: () => void }) => {
  const { onClose } = props;
  const [statistics, setStatistics] = useState<OneStatistic[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogs = (newLogs: Log[]) => {
    const obj: Record<string, OneStatistic | undefined> = {};

    unionBy(newLogs, 'message').forEach((log) => {
      if (!obj[log.createByUser]) {
        obj[log.createByUser] = {
          username: log.createByUser,
          count: 0,
          ratio: 0,
        };
      }

      obj[log.createByUser].count += 1;
    });

    const res = sortBy(Object.values(obj), 'count').reverse();
    const max = res[0]?.count || 1;

    res.forEach((li) => {
      li.ratio = li.count / max;
    });

    return res;
  };

  const refresh = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await request.get<Log[]>('/statistics/log');

      return res.data;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useMount(async () => {
    const logs = await refresh();

    setStatistics(handleLogs(logs));
  });

  return (
    <div className={c('flex justify-center items-center w-full h-full fixed left-0 top-0 z-10 overflow-hidden')}>
      <div className={c('w-80 h-[90%] flex flex-col bg-gray-800 rounded-[12px] p-3 text-white shadow overflow-hidden')}>
        <div className={c('w-full flex justify-between items-center')}>
          <div
            onClick={() => onClose()}
            className={c(
              'flex mb-2 justify-center items-center text-gray-600 rounded-full w-8 h-8 select-none cursor-pointer'
            )}
          >
            x
          </div>

          <div>Statistics</div>

          <div
            className={c('w-8 cursor-pointer flex justify-center items-center text-gray-600', {
              [c('animate-spin !cursor-not-allowed')]: loading,
            })}
            onClick={refresh}
          >
            R
          </div>
        </div>
        <div className={c('flex flex-col overflow-y-scroll px-3')}>
          {statistics.map((li) => {
            return (
              <div key={li.username} className={c('flex flex-col mb-2')}>
                <div className={c('text-gray-400 mb-1')}>{li.username}</div>
                <div className={c('h-6 bg-slate-900 rounded relative overflow-hidden')}>
                  <div
                    className={c('h-full absolute left-0 top-0 bg-slate-600 z-[1]')}
                    style={{ width: `${100 * li.ratio}%` }}
                  />

                  <div className={c('flex justify-center absolute left-0 h-full items-center z-[2] px-1')}>
                    <div className={c('text-white text-xs flex')}>{li.count}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
