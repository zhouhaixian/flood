// https://www.unicareer.com/login/fast-login
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .post('https://www.unicareer.com/login/user-c-bff/v1/user/self/authCode', {
      json: {
        phone: { countryCode: '86', number: target },
        type: 'login',
      },
    })
    .json()) as any;

  if (data.success) {
    return data;
  } else {
    throw new core.APIError(data.msg, data);
  }
}
