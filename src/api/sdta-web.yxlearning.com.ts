// http://sdta-web.yxlearning.com/staffRegister.shtml
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .post('http://sdta-web.yxlearning.com/sendPhoneCode.gson', {
      form: { phone: target, sendType: 4 },
    })
    .json()) as any;

  const result = data.responseInfo;
  if (result.respCode === '1') {
    return data;
  } else {
    throw new core.APIError(result.respCode, data);
  }
}
