import axios from 'axios';
import { APIError } from '../api-error';
import { CaptchaError } from '../captcha-error';
import getImage from '../get-image';
import { recognize } from '../scanner';

export default async function (target: number) {
  const insertCookie = await getInsertCookie();
  const { captcha, session } = await getCaptchaAndSession(insertCookie);

  const headers = {
    accept: 'application/json, text/javascript, */*; q=0.01',
    'accept-language': 'zh-CN,zh;q=0.9',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'sec-ch-ua':
      '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'x-requested-with': 'XMLHttpRequest',
    cookie: `${insertCookie}; ${session}`,
    Referer: 'https://user.mofcom.gov.cn/registration?siteId=yhdl',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  const code = await recognize(captcha);
  const { data } = await axios.post(
    'https://user.mofcom.gov.cn/registration/sms/send',
    `phone=${target}&imgCode=${code}`,
    { headers },
  );

  if (data.status === 's200') {
    return data;
  } else if (data.msg === '图片验证码填写错误。') {
    throw new CaptchaError(data.msg, data);
  } else {
    throw new APIError(data.msg, data);
  }
}

async function getCaptchaAndSession(cookie: string) {
  const requestHeaders = {
    accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'accept-language': 'zh-CN,zh;q=0.9',
    'sec-ch-ua':
      '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'image',
    'sec-fetch-mode': 'no-cors',
    'sec-fetch-site': 'same-origin',
    cookie,
    Referer: 'https://user.mofcom.gov.cn/registration?siteId=yhdl',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  const { data, headers } = await getImage(
    'https://user.mofcom.gov.cn/registration/imgCode',
    {
      headers: requestHeaders,
    },
  );

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const cookies = headers['set-cookie']![0];
  if (cookies === undefined) throw Error('Cookie 为空');

  return {
    captcha: data,
    session: cookies.split(';')[0],
  };
}

async function getInsertCookie() {
  const requestHeaders = {
    accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-language': 'zh-CN,zh;q=0.9',
    'cache-control': 'max-age=0',
    'sec-ch-ua':
      '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
  };

  const { headers } = await axios.get(
    'https://user.mofcom.gov.cn/registration?siteId=yhdl',
    { headers: requestHeaders },
  );

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const cookies = headers['set-cookie']![0];
  if (cookies === undefined) throw Error('Cookie 为空');

  return cookies.split(';')[0];
}
