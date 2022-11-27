import fs from 'fs';
import path from 'path';

const url = process.argv[2];
const fileName = process.argv[3];
const isWithCaptcha = process.argv[4] === '-captcha';
const filePath = path.resolve(__dirname, `../src/api/${fileName}.ts`);
if (fileName === undefined || url === undefined) throw Error('文件名不能为空!');
try {
  fs.accessSync(filePath), fs.constants.F_OK;
} catch {
  fs.writeFileSync(
    filePath,
    isWithCaptcha ? getTemplateOfCaptcha() : getTemplate(),
  );
  process.exit(0)
}
throw Error('文件已存在')

function getTemplate() {
  return `// ${url}
  import { Core } from '../core';
  
  export default async function (target: string) {
    const core = new Core();
  
    const data = (await core
      .post('TODO', {
        TODO,
      })
      .json()) as any;
  
    if (TODO) {
      return data;
    } else {
      throw new core.APIError(TODO, data);
    }
  }
  `;
}

function getTemplateOfCaptcha() {
  return `// ${url}
  import { Core } from '../core';
  
  export default async function (target: string) {
    const core = new Core();
    const captcha = await core.verify(
      'TODO',
    );
  
    const data = (await core
      .post('TODO', {
        TODO,
      })
      .json()) as any;
  
    if (TODO) {
      return data;
    } else if (TODO) {
      throw new core.CaptchaError(TODO, data);
    } else {
      throw new core.APIError(TODO, data);
    }
  }
  `;
}
