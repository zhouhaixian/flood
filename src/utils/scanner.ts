import Tesseract from 'tesseract.js';

async function recognize(image: Buffer) {
  return (await Tesseract.recognize(image, 'eng')).data.text.replace(/\W/g, '');
}

export { recognize };
