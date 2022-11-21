import fs from 'fs/promises';
import path from 'path';

const fileName = process.argv[2];
if (fileName === undefined) throw Error('文件名不能为空!');
fs.rm(path.resolve(__dirname, `../src/api/${fileName}.ts`)).catch((reason) => {
  throw Error(reason);
});
