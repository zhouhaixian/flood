// http://touch.shio.gov.cn/usercenter/register.aspx
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();
  const headers = {
    accept: '*/*',
    'accept-language': 'zh-CN,zh;q=0.9',
    'sec-ch-ua':
      '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'x-requested-with': 'XMLHttpRequest',
    Referer: 'https://touch.shio.gov.cn/jsp/register.jsp',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  const data = (await core
    .get('https://touch.shio.gov.cn/zcyhglWebsite/send_code.ashx', {
      headers,
      searchParams: { m: target },
    })
    .json()) as any;

  if (data.Result === 1) {
    return data;
  } else {
    throw new core.APIError(data.Result, data);
  }
}
