// https://cowtransfer.com/login
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .get('https://cowtransfer.com/api/user/register/mobilesignin', {
      searchParams: { mobile: target, joinProToken: '' },
    })
    .json()) as any;

  if (data.errorCode === 1) {
    return data;
  } else {
    throw new core.APIError(data.errorCode, data);
  }
}
