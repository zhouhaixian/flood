// https://h5.dashanedu.com/user/mobile/login
import { Core } from '../core';
import got from 'got';

export default async function (target: string) {
  const core = new Core();

  const data = (await got
    .post('https://h5.dashanedu.com/user/mobile/auth', {
      form: {
        phone: target,
        type: 2,
      },
    })
    .json()) as any;

  if (data.msg === '成功') {
    return data;
  } else {
    throw new core.APIError(data.msg, data);
  }
}
