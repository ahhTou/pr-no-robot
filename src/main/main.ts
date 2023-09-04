import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

import { createPRServer } from './server';
import { addLogs } from './store';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload-github.js'),
    },
  });

  const server = await createPRServer({
    onReceivedID(id) {
      mainWindow.loadURL(`https://github.com/SplashtopInc/sep/pull/${id}/files`);
    },
  });

  ipcMain.handle('github_got_username_info', (_, uname: any) => {
    const { id, username } = uname;

    addLogs({
      message: `Try to approval PR #${id}`,
      description: `Create by user '${username}'`,
      createByUser: username,
    });
  });

  server.start();

  // const view = new BrowserView({
  //   webPreferences: {
  //     preload: path.join(__dirname, 'preload-github.js'),
  //   },
  // });

  // mainWindow.setBrowserView(view);

  // view.webContents.openDevTools();
  // view.setBounds({ x: 0, y: 0, width: 1200, height: 800 });
  // view.webContents.loadURL('https://github.com/SplashtopInc/sep');

  mainWindow.loadURL('https://github.com/SplashtopInc/sep');

  // and load the index.html of the app.
  // if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
  //   mainWindow.loadURL('MAIN_WINDOW_VITE_DEV_SERVER_URL');
  // } else {
  //   mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  // }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
