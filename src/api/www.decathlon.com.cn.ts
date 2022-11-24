// https://www.decathlon.com.cn/zh/create
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();
  await core.get('https://www.decathlon.com.cn/zh/');
  await core.get('https://www.decathlon.com.cn/zh/create');

  const data = (await core
    .post(
      'https://www.decathlon.com.cn/zh/ajax/rest/model/atg/userprofiling/ProfileActor/send-mobile-verification-code',
      {
        json: {
          countryCode: 'CN',
          mobile: target,
        },
      },
    )
    .json()) as any;

  if (data.responseTO.httpStatus === 200) {
    return data;
  } else {
    throw new core.APIError(data.responseTO, data);
  }
}
