import type { MyResponse } from 'src/main/server';

const urlPreHandle = (url: string) => {
  if (process.env.NODE_ENV === 'development') return `/api${url}`;

  return url;
};

const get = async <T = any>(
  url: string,
  params?: { [key: string]: boolean | number | string }
): Promise<MyResponse<T>> => {
  const queryString = Object.entries(params || {})
    .map(([key, val]) => encodeURIComponent(key) + '=' + encodeURIComponent(val))
    .join('&');
  const _url = queryString ? `${url}?${queryString}` : url;

  return (await fetch(urlPreHandle(_url))).json();
};

const request = {
  get,
};

export default request;
