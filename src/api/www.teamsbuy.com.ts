// https://www.teamsbuy.com/login/login_vcode.html
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();
  const captcha = await core.verify(
    'https://www.teamsbuy.com/api/v1/home/common/getImageCode',
    {},
    0,
  );

  const data = (await core
    .post('https://www.teamsbuy.com/api/v1/home/common/sendSMS', {
      form: { mobile: target, code2: captcha },
    })
    .json()) as any;

  if (data.message === 'success') {
    return data;
  } else if (data.message === '图片验证码不正确') {
    throw new core.CaptchaError(data.message, data);
  } else {
    throw new core.APIError(data.message, data);
  }
}
