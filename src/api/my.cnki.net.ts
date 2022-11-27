// https://my.cnki.net/Register/CommonRegister.aspx?returnUrl=https://www.cnki.net
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();
  await core.get(
    'https://my.cnki.net/Register/CommonRegister.aspx?returnUrl=https://www.cnki.net',
  );
  const captcha = await core.verify(
    'https://my.cnki.net/Register/CheckCode.aspx',
  );

  const headers = {
    accept: '*/*',
    'accept-language': 'zh-CN,zh;q=0.9',
    'sec-ch-ua':
      '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    Referer:
      'https://my.cnki.net/Register/CommonRegister.aspx?returnUrl=https://www.cnki.net',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  const { body } = await core.post('https://my.cnki.net/Register/Server.aspx', {
    headers,
    searchParams: {
      mobile: parseInt(target),
      operatetype: 2,
      imageCode: captcha,
    },
  });

  if (body === '1') {
    return body;
  } else if (body === '0') {
    throw new core.CaptchaError(body, body);
  } else {
    throw new core.APIError(body, body);
  }
}
