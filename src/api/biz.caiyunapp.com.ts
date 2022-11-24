// https://fanyi.caiyunapp.com/
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .post('https://biz.caiyunapp.com/v1/send_sms_code', {
      json: { area_code: '86', phone_num: target },
      headers: {
        Referer: 'https://fanyi.caiyunapp.com/',
        'Cy-Token': 'token 9876032166',
      },
    })
    .json()) as any;

  if (data.status === 'ok') {
    return data;
  } else {
    throw new core.APIError(data.status, data);
  }
}
