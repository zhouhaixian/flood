// https://vip.qianlima.com/register.html?referUrl=https://vip.qianlima.com/
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .post('https://vip.qianlima.com/rest/u/api/user/register/mobile/code', {
      form: { tips: 1, shouji: target },
    })
    .json()) as any;

  if (data.code === 200) {
    return data;
  } else {
    throw new core.APIError(data.msg, data);
  }
}
