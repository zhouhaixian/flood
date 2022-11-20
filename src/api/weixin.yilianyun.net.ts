// http://weixin.yilianyun.net/user/login-code
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .post('http://weixin.yilianyun.net/user/send-sms', {
      form: { tel: target },
    })
    .json()) as any;

  if (data.msg === '发送成功') {
    return data;
  } else {
    throw new core.APIError(data.msg, data);
  }
}
