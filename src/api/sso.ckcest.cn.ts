// https://sso.ckcest.cn/portal/register?device=pc
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .post('https://sso.ckcest.cn/portal/sendSmsCode', {
      form: { mobile: target },
    })
    .json()) as any;

  if (data.success) {
    return data;
  } else {
    throw new core.APIError(data, data);
  }
}
