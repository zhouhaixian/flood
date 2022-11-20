// https://www.vcooline.com/tenant/vcl_tenant/login?login_type=phone_verify_code
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .post('https://www.vcooline.com/tenant/vcl_tenant/phones/verify_codes', {
      searchParams: {
        phone_number: target,
      },
    })
    .json()) as any;

  return data;
}
