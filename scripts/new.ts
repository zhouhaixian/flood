import fs from 'fs/promises';
import path from 'path';

const url = process.argv[2];
const fileName = process.argv[3];
const isWithCaptcha = process.argv[4] === '-captcha';
if (fileName === undefined || url === undefined) throw Error('文件名不能为空!');
fs.writeFile(
  path.resolve(__dirname, `../src/api/${fileName}.ts`),
  isWithCaptcha ? getBaseWithCaptcha() : getBase(),
).catch((reason) => {
  throw Error(reason);
});

function getBase() {
  return `// ${url}
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .post(TODO, {
      TODO,
    })
    .json()) as any;

  if (TODO) {
    return TODO;
  } else {
    throw new core.APIError(TODO, TODO);
  }
}
`;
}

function getBaseWithCaptcha() {
  return `// ${url}
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();
  const captcha = await core.verify(
    TODO,
  );

  const data = (await core
    .post(TODO, {
      TODO,
    })
    .json()) as any;

  if (TODO) {
    return TODO;
  } else if (TODO) {
    throw new core.CaptchaError(TODO, TODO);
  } else {
    throw new core.APIError(TODO, TODO);
  }
}
`;
}
