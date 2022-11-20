import { Cookie, CookieJar } from 'tough-cookie';
import got, {
  CancelableRequest,
  OptionsOfTextResponseBody,
  Response,
} from 'got';
import { recognize } from './utils/scanner';
import { APIError, CaptchaError } from './errors';

export class Core {
  public cookies = new CookieJar();
  public APIError = APIError;
  public CaptchaError = CaptchaError;
  public headers = {
    'sec-ch-ua':
      '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
  };

  public get(
    url: string | URL,
    options?: OptionsOfTextResponseBody | undefined,
  ): CancelableRequest<Response<any>> {
    const client = got.get(url, { ...options, cookieJar: this.cookies });

    client.then((data) => {
      if (Array.isArray(data.headers['set-cookie']))
        data.headers['set-cookie'].forEach((item) => {
          const { key, value, path } = Cookie.parse(item) as Cookie;
          this.cookies.setCookie(`${key}=${value}`, path ?? '/');
        });
    });
    return client;
  }

  public post(
    url: string | URL,
    options?: OptionsOfTextResponseBody | undefined,
  ): CancelableRequest<Response<any>> {
    const client = got.post(url, { ...options, cookieJar: this.cookies });

    client.then((data) => {
      if (Array.isArray(data.headers['set-cookie']))
        data.headers['set-cookie'].forEach((item) => {
          const { key, value, path } = Cookie.parse(item) as Cookie;
          this.cookies.setCookie(`${key}=${value}`, path ?? '/');
        });
    });
    return client;
  }

  public verify(
    url: string,
    options?: OptionsOfTextResponseBody | undefined,
  ): Promise<string> {
    return new Promise((resolve) => {
      const timestamp = new Date().getTime().toString();
      const client = got.get(url, {
        ...options,
        cookieJar: this.cookies,
        searchParams: { timestamp, dt: timestamp, id: timestamp },
      });

      client.then((data) => {
        if (Array.isArray(data.headers['set-cookie']))
          data.headers['set-cookie'].forEach((item) => {
            const { key, value, path } = Cookie.parse(item) as Cookie;
            this.cookies.setCookie(`${key}=${value}`, path ?? '/');
          });
      });

      client
        .buffer()
        .then((data) => {
          return recognize(data);
        })
        .then((data) => {
          resolve(data);
        });
    });
  }
}
