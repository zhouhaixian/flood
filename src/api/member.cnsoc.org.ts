// https://member.cnsoc.org/members/reg.html
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .post('https://member.cnsoc.org/members/send_reg_sms_code.html', {
      form: { mobile: target },
    })
    .json()) as any;

  if (data.msg === 'ζδΊ€ζε') {
    return data;
  } else {
    throw new core.APIError(data.msg, data);
  }
}
