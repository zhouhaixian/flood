// https://cg.163.com/
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .post(`https://n.cg.163.com/api/v1/phone-captchas/86-${target}`, {
      json: { etc: { validate: '' } },
    })
    .json()) as any;

  return data;
}
