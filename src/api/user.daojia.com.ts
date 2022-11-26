// null
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .get('https://user.daojia.com/mobile/getcode', {
      searchParams: { mobile: target },
    })
    .json()) as any;

  if (data.desc === '成功') {
    return data;
  } else {
    throw new core.APIError(data.desc, data);
  }
}
