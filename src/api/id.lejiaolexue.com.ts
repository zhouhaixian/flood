// null
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .get('http://id.lejiaolexue.com/api/sendvericode.ashx', {
      searchParams: { phone: target },
    })
    .json()) as any;

  if (data.msg === '成功') {
    return data;
  } else {
    throw new core.APIError(data.msg, data);
  }
}
