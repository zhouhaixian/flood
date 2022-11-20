// https://user.mofcom.gov.cn/registration?siteId=yhdl
import { Core } from '../core';
export default async function (target: string) {
  const core = new Core();
  await core.get('https://user.mofcom.gov.cn/registration?siteId=yhdl');
  const captcha = await core.verify(
    'https://user.mofcom.gov.cn/registration/imgCode',
  );

  const data = (await core
    .post('https://user.mofcom.gov.cn/registration/sms/send', {
      form: { phone: target, imgCode: captcha },
    })
    .json()) as any;

  if (data.status === 's200') {
    return data;
  } else if (data.msg === '图片验证码填写错误。') {
    throw new core.CaptchaError(data.msg, data);
  } else {
    throw new core.APIError(data.msg, data);
  }
}
