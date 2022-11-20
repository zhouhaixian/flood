// https://www.huiwww.com/user/register.php
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .post('https://www.huiwww.com/user/register.php', {
      form: {
        country: '+86',
        phone: target,
        method: 'getMobileCode',
      },
    })
    .json()) as any;

  if (data.status === 'y') {
    return data;
  } else {
    throw new core.APIError(data.status, data);
  }
}
