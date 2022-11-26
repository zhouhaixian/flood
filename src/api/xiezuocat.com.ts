// https://xiezuocat.com/#/
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .post('https://xiezuocat.com/verify?type=signup', {
      json: { phone: `86-${target}` },
    })
    .json()) as any;

  if (data.msg === 'success') {
    return data;
  } else {
    throw new core.APIError(data.msg, data);
  }
}
