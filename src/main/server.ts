import { Server } from 'http';
import path from 'path';
import Koa from 'koa';
import serve from 'koa-static';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

import { getLogs } from './store';

export type MyResponse<T = any> = {
  message: string;
  data: T;
};

const logInfo = (...args: string[]) => console.log(`[ex-auth.server] ${args.join(' ')}`);

export async function createPRServer(options?: { onReceivedID?: (id: string) => void }) {
  const { onReceivedID } = options;
  const port = 8848;
  const app = new Koa();
  const router = new Router();

  let server: Server | null = null;

  router.get('/pr/:id', (ctx) => {
    const { id } = ctx.params;

    if (id) {
      onReceivedID?.(id);
    }

    ctx.redirect('/success.html');
  });

  router.get('/statistics/log', (ctx) => {
    const data = getLogs();

    // 设置响应体
    ctx.body = { message: 'success', data };
    // 设置 Content-Type 头部
    ctx.type = 'application/json';
  });

  app.use(serve(path.resolve(__dirname, '../../dist')));
  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.allowedMethods());

  return {
    start: async () => {
      server = app.listen(port);

      logInfo(`start server (${port})`);

      return server;
    },
    stop: async () => {
      logInfo(`stopping server failed ${port}`);

      await new Promise((resolve, reject) => {
        if (server) {
          server.close((err) => {
            if (!err) {
              logInfo(`stop server (${port}) success`);
              resolve({});
            } else {
              logInfo(`stop server (${port}) failed`);
              reject(err);
            }
          });
        }

        resolve({});
      });
    },
  };
}
