// http://www.yhis999.cn/yunhis/register.do?act=query
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .post('http://www.yhis999.cn/yunhis/register.do?act=lable&type=yzm', {
      form: { lxdh: target },
    })
    .json()) as any;

  if (data.message === '0') {
    return data;
  } else {
    throw new core.APIError(data.message, data);
  }
}
