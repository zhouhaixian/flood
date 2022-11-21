import fs from 'fs/promises';
import path from 'path';

const fileName = process.argv[2];
fs.rm(path.resolve(__dirname, `../src/api/${fileName}.ts`));
