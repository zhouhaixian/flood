import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();
  const headers = {
    accept: 'application/json, text/javascript, */*; q=0.01',
    'accept-language': 'zh-CN,zh;q=0.9',
    'content-type': 'application/x-www-form-urlencoded',
    'sec-ch-ua':
      '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'x-requested-with': 'XMLHttpRequest',
    Referer:
      'https://facade.bznins.com/user/register?service=https://www.bznins.com/index',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  const data = (await core
    .post('https://facade.bznins.com/user/checkRegister', {
      headers,
      form: { mobilePhone: target },
    })
    .json()) as any;

  if (data.message === 'success') {
    return data;
  } else {
    throw new core.APIError(data.code, data);
  }
}
