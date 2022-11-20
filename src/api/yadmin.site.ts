// http://yadmin.site/user/passport/
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .post('http://yadmin.site/user/passport/sms_send', {
      form: { phone: target },
    })
    .json()) as any;

  if (data.msg === '已发送') {
    return data;
  } else {
    throw new core.APIError(data.msg, data);
  }
}
