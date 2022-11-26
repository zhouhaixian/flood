// https://www.maxell-dm.cn/register.aspx
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .post('https://www.maxell-dm.cn/Code/CheckImage.aspx', {
      form: { action: 'send', txtMember_Name: target },
    })
    .text()) as any;

  if (data === 'true') {
    return data;
  } else {
    throw new core.APIError(data, data);
  }
}
