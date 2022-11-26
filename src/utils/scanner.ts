import sharp from 'sharp';
import Tesseract from 'tesseract.js';
import fs from 'fs/promises';
import path from 'path';

async function deNoise(image: Buffer, thresholdValue: number): Promise<Buffer> {
  const data = await sharp(image)
    .resize(600)
    .greyscale()
    .normalise()
    .threshold(thresholdValue)
    .toBuffer();

  if (process.env['NODE_ENV'] === 'development') {
    fs.writeFile(
      path.resolve(__dirname, '../../temp/captcha_origin.jpg'),
      image,
    );
    fs.writeFile(
      path.resolve(__dirname, '../../temp/captcha_processed.jpg'),
      data,
    );
  }
  return data;
}

async function recognize(image: Buffer, thresholdValue = 80) {
  return (
    await Tesseract.recognize(await deNoise(image, thresholdValue), 'eng')
  ).data.text.replace(/\W/g, '');
}

export { recognize };
