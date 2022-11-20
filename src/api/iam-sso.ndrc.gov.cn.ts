// https://iam-sso.ndrc.gov.cn:8443/userregist/regist/touser
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();
  await core.get('https://iam-sso.ndrc.gov.cn:8443/userregist/regist/touser');
  const captcha = await core.verify(
    'https://iam-sso.ndrc.gov.cn:8443/userregist/regist/Kaptcha.jpg',
  );

  const body = (await core
    .post('https://iam-sso.ndrc.gov.cn:8443/userregist/regist/sendSmsCode', {
      form: { mobileNo: target, imgCode: captcha },
    })
    .json()) as any;

  if (body.success) {
    return body;
  } else if (body.errorMsg === '图片验证码错误') {
    throw new core.CaptchaError(body.msg, body);
  } else {
    throw new core.APIError(body.msg, body);
  }
}
