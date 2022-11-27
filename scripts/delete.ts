import fs from 'fs';
import path from 'path';

const fileName = process.argv[2];
if (fileName === undefined) throw Error('文件名不能为空!');
const filePath = path.resolve(__dirname, `../src/api/${fileName}.ts`);
if (fileName === undefined) throw Error('文件名不能为空!');
try {
  fs.accessSync(filePath), fs.constants.F_OK;
  fs.rmSync(filePath);
} catch {
  throw Error(`${filePath} 不是个目录或文件`);
}
