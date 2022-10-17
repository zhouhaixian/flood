import axios from 'axios';
import { APIError } from '../api-error';

export default async function (target: string) {
  const headers = {
    accept: 'application/json, text/javascript, */*; q=0.01',
    'accept-language': 'zh-CN,zh;q=0.9',
    'content-type': 'application/json',
    'sec-ch-ua':
      '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    Referer: 'https://user.todesk.com/',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  const { data } = await axios.post(
    'https://wechat.todesk.com/api/phone/phonecode',
    { phone: target },
    { headers },
  );

  if (data.code === 200) {
    return data;
  } else {
    throw new APIError(data.code, data);
  }
}
