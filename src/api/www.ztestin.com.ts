// https://www.ztestin.com/users/register?from=menu
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  await core.get('https://www.ztestin.com/users/vercode?id=vercode_old');
  const data = (await core
    .post('https://www.ztestin.com/users/send/vercode', {
      form: { phone: target, type: 'register', voice: 0 },
      headers: {
        accept: '*/*',
        'accept-language': 'zh-CN,zh;q=0.9',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'sec-ch-ua':
          '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-requested-with': 'XMLHttpRequest',
      },
    })
    .json()) as any;

  if (data.msg === '发送验证码成功') {
    return data;
  } else {
    throw new core.APIError(data.msg, data);
  }
}
