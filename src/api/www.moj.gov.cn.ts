import { Core } from '../core';
export default async function (target: string) {
  const core = new Core();
  // core.get('http://www.moj.gov.cn/sfbsso/verifyImage');
  const data = (await core
    .post('http://www.moj.gov.cn/sfbsso/SMS/sendSecurityCode', {
      json: { businessType: 1, telephone: target },
    })
    .json()) as any;

  if (data.success) {
    return data;
  } else {
    throw new core.APIError(data.msg, data);
  }
}
