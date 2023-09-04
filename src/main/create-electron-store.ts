import { unlinkSync } from 'fs';
import path from 'path';
import { app } from 'electron';
import Store from 'electron-store';

const logInfo = (...str: any) => console.log(`[create-electron-store] ${str}`);

export default function createElectronStore<T extends Record<string, any>>(config: Store.Options<T> | undefined) {
  const filePath = path.join(app.getPath('userData'), config?.name ? `${config?.name}.json` : `config.json`);

  let store: Store<T> | null = null;

  try {
    store = new Store(config);
  } catch (err0) {
    logInfo('Crete store Error', err0);
    try {
      unlinkSync(filePath);
    } catch (err1) {
      logInfo('Delete file Error', err1);
    }
  } finally {
    store = new Store(config);
  }

  return store;
}
