// https://www.kantuzhe.com/sys/regedit.aspx
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = await core
    .post('https://www.kantuzhe.com/models/m_main.aspx', {
      form: {
        ffm: 'Send_yzm',
        yzm: 843138,
        types: 'zhuce',
        sjh: target,
      },
    })
    .text();

  if (data === '发送成功') {
    return data;
  } else {
    throw new core.APIError(data, data);
  }
}
