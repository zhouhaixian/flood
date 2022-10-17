import gm from 'gm';
import Tesseract from 'tesseract.js';

function deNoise(image: Buffer, thresholdValue: number): Promise<Buffer> {
  const im = gm.subClass({ imageMagick: true });
  return new Promise((resolve, reject) => {
    im(image)
      .autoOrient()
      .colorspace('gray')
      .normalize()
      .threshold(thresholdValue, true)
      .toBuffer((error, buffer) => {
        if (error !== null) {
          reject(error);
        } else {
          resolve(buffer);
        }
      });
  });
}

async function recognize(image: Buffer) {
  return (
    await Tesseract.recognize(await deNoise(image, 40), 'eng')
  ).data.text.replace(/\W/g, '');
}

export { recognize };
