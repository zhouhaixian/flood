// https://sec.midea.com/mobile/signin/sms/?system=mideamall&channel_code=1.1.1.2.2.21.1.1&redirect_uri=https%3A%2F%2Fm.midea.cn%2Fnext%2Fuserinfo%2Floginbyc4atokencallback%3Frurl%3Dhttps%253A%252F%252Fm.midea.cn%252Fcart%26channel_code%3D1.1.1.2.2.21.1.1%26system%3Dmideamall
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .post('https://sec.midea.com/security/sms/send', {
      json: { mobile: target, openId: null, t: '1' },
    })
    .json()) as any;

  if (data.msg === '短信发送成功') {
    return data;
  } else {
    throw new core.APIError(data.msg, data);
  }
}
