// https://www.yuque.com/login
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .post('https://www.yuque.com/api/validation_codes', {
      json: { action: 'login', channel: 'sms', target },
      headers: {
        referer: 'https://www.yuque.com/login',
      },
    })
    .json()) as any;

  if (data.data) {
    return data;
  } else {
    throw new core.APIError(data.data, data);
  }
}
