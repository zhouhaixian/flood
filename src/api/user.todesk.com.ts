import { Core } from '../core';
export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .post('https://wechat.todesk.com/api/phone/phonecode', {
      form: { phone: target },
    })
    .json()) as any;

  if (data.code === 200) {
    return data;
  } else {
    throw new core.APIError(data.code, data);
  }
}
