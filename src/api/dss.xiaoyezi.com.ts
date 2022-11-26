// null
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .get('https://dss.xiaoyezi.com/student_app/auth/validate_code', {
      searchParams: { mobile: target, country_code: 86 },
    })
    .json()) as any;

  if (data.code === 0) {
    return data;
  } else {
    throw new core.APIError(data.code, data);
  }
}
