import { Page } from "puppeteer";

export function getUrl(f: Function) {
  return f.name.replaceAll("_", ".");
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function solveSlider(
  sliderSelector: string,
  sliderHandleSelector: string,
  page: Page
) {
  const sliderElement = await page.waitForSelector(sliderSelector);
  const slider = await sliderElement!.boundingBox();
  const sliderHandleElement = await page.waitForSelector(sliderHandleSelector);
  const sliderHandle = await sliderHandleElement!.boundingBox();
  await solveSliderCaptcha(
    sliderSelector,
    slider!.x + slider!.width / 2 + sliderHandle!.width,
    page
  );
}

export async function solveSliderCaptcha(
  sliderSelector: string,
  endpointX: number,
  page: Page
) {
  const sliderElement = await page.waitForSelector(sliderSelector);
  const slider = await sliderElement!.boundingBox();
  const x = slider!.x + slider!.width / 2;
  const y = slider!.y + slider!.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  const distance = endpointX - x;
  const distance1 = distance * 0.3;
  const distance2 = distance1 + distance * 0.5;
  const distance3 = distance2 + distance * 0.2;
  const step1 = distance1 / 10;
  const step2 = distance2 / 10;
  const step3 = distance3 / 10;
  await page.mouse.move(slider!.x + distance1, y + 3, { steps: step1 });
  await sleep(521);
  await page.mouse.move(slider!.x + distance2, y - 2, { steps: step2 });
  await sleep(636);
  await page.mouse.move(slider!.x + distance2 - 9, y + 4, {
    steps: step3,
  });
  await sleep(123);
  await page.mouse.move(slider!.x + distance2 + 10, y - 5, {
    steps: step3,
  });
  await sleep(321);
  await page.mouse.move(slider!.x + distance3, y, { steps: step3 });
  await page.mouse.up();
}
