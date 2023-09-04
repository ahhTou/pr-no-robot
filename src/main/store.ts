import createElectronStore from './create-electron-store';

type Log = {
  message: string;
  description: string;
  createByUser: string;
  timestamp: number;
};

const logsStore = createElectronStore<{ logs: Log[] }>({
  defaults: { logs: [] },
  name: 'logs',
});

export function addLogs(log: Partial<Log>) {
  const logs = logsStore.get('logs');

  const defaultLog: Log = {
    message: 'NO_MESSAGE',
    description: 'NO_DESCRIPTION',
    createByUser: 'NO_USER',
    timestamp: new Date().getTime(),
  };

  logs.push({
    ...defaultLog,
    ...log,
  });

  logsStore.set('logs', logs);
}
