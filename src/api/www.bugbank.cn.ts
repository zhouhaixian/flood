// https://www.bugbank.cn/signup.html
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .post('https://www.bugbank.cn/api/verifymobile', {
      form: { mobile: target },
    })
    .json()) as any;

  if (data.msg === '发送验证码成功') {
    return data;
  } else {
    throw new core.APIError(data.msg, data);
  }
}
