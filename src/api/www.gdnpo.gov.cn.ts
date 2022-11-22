// https://www.gdnpo.gov.cn/home/pubadd2/IndexPubreg
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .get('https://www.gdnpo.gov.cn/home/pubbase/AccRegApi/sendvercode', {
      searchParams: { Phone: target },
    })
    .text()) as any;

  return data;
}
