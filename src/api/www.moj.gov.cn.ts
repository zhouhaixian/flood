import axios from 'axios';
import { APIError } from '../api-error';

export default async function (target: number) {
  const cookies = await getCaptchaAndCookies();

  const headers = {
    accept: 'application/json, text/javascript, */*; q=0.01',
    'accept-language': 'zh-CN,zh;q=0.9',
    'content-type': 'application/json',
    'x-requested-with': 'XMLHttpRequest',
    cookie: cookies,
    Referer: 'http://www.moj.gov.cn/sfbsso/register.html',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  const { data } = await axios.post(
    'http://www.moj.gov.cn/sfbsso/SMS/sendSecurityCode',
    { businessType: 1, telephone: target },
    { headers },
  );

  if (data.success) {
    return data;
  } else {
    throw new APIError(data.msg, data);
  }
}

async function getCaptchaAndCookies() {
  const requestHeaders = {
    accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'accept-language': 'zh-CN,zh;q=0.9',
    Referer: 'http://www.moj.gov.cn/sfbsso/register.html',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  const { headers } = await axios.get(
    'http://www.moj.gov.cn/sfbsso/verifyImage',
    {
      headers: requestHeaders,
    },
  );

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const cookieOne = headers['set-cookie']![0].split(';')[0];
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const cookieTwo = headers['set-cookie']![1].split(';')[0];
  if (cookieOne === undefined || cookieTwo === undefined)
    throw Error('Cookie 为空');

  return `${cookieOne}; ${cookieTwo}`;
}
