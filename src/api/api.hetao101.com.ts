// null
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .get('https://api.hetao101.com/login/v2/account/oauth/verifyCode', {
      searchParams: { phoneNumber: target },
    })
    .json()) as any;

  if (data.errMsg === 'success') {
    return data;
  } else {
    throw new core.APIError(data.errMsg, data);
  }
}
