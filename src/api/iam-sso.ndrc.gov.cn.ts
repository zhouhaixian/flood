import axios from 'axios';
import { APIError } from '../api-error';
import { CaptchaError } from '../captcha-error';
import getImage from '../get-image';
import { recognize } from '../scanner';

export default async function (target: number) {
  const cookie = await getCookie();
  const captcha = await getCaptcha(cookie);

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
    cookie,
    Referer: 'https://iam-sso.ndrc.gov.cn:8443/userregist/regist/touser',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  const code = await recognize(captcha);
  const { data } = await axios.post(
    'https://iam-sso.ndrc.gov.cn:8443/userregist/regist/sendSmsCode',
    `mobileNo=${target}&imgCode=${code}`,
    { headers },
  );

  if (data.success) {
    return data;
  } else if (data.errorMsg === '图片验证码错误') {
    throw new CaptchaError(data.msg, data);
  } else {
    throw new APIError(data.msg, data);
  }
}

async function getCaptcha(cookie: string) {
  const requestHeaders = {
    accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'accept-language': 'zh-CN,zh;q=0.9',
    'cache-control': 'no-cache',
    pragma: 'no-cache',
    'sec-ch-ua':
      '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'image',
    'sec-fetch-mode': 'no-cors',
    'sec-fetch-site': 'same-origin',
    cookie,
    Referer: 'https://iam-sso.ndrc.gov.cn:8443/userregist/regist/touser',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  const { data } = await getImage(
    'https://iam-sso.ndrc.gov.cn:8443/userregist/regist/Kaptcha.jpg',
    {
      headers: requestHeaders,
    },
  );

  return data;
}

async function getCookie() {
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
    'https://iam-sso.ndrc.gov.cn:8443/userregist/regist/touser',
    { headers: requestHeaders },
  );

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const cookieOne = headers['set-cookie']![0].split(';')[0];
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const cookieTwo = headers['set-cookie']![1].split(';')[0];
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const cookieThree = headers['set-cookie']![2].split(';')[0];

  if (
    cookieOne === undefined ||
    cookieTwo === undefined ||
    cookieThree === undefined
  )
    throw Error('Cookie 为空');

  return `${cookieOne}; ${cookieTwo}; ${cookieThree}`;
}
