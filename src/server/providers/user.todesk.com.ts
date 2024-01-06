import { BrowserManager } from "../browser.js";
import { OCR } from "../ocr.js";
import { CaptchaIncorrectError, ProviderError } from "../provider.error.js";
import { solveSliderCaptcha } from "../utils.js";

const url = "https://user.todesk.com/login?redirect=%2Fdashboard";
export async function user_todesk_com(phone: string) {
  const page = await BrowserManager.newPage(url);

  try {
    await page.waitForSelector("#login_appLogin", { visible: true });
    await page.evaluate(() => {
      document.querySelector<HTMLButtonElement>("#login_appLogin")!.click();
    });
    await page.waitForSelector("input#phone", { visible: true });
    await page.type("input#phone", phone);
    await page.click("button#login_loginSubmit");

    await page.waitForSelector("img#img", {
      visible: true,
    });
    const bgImg = await page.evaluate(() => {
      return document
        .querySelector<HTMLImageElement>("img#img")!
        .src.replace("data:image/png;base64,", "");
    });
    const targetImg = await page.evaluate(() => {
      return document
        .querySelector<HTMLImageElement>("div.img-slider img")!
        .src.replace("data:image/png;base64,", "");
    });
    const targetImgElement = await page.$("div.img-slider img");
    const targetImgBox = await targetImgElement!.boundingBox();
    const captchaResult = await OCR.slideMatch(targetImg, bgImg);

    await solveSliderCaptcha(
      "div.vue-slider-captcha-slider",
      targetImgBox!.x + targetImgBox!.width + captchaResult.target[0],
      page
    );
    const verifyResponse = await page.waitForResponse(
      "https://user.todesk.com/api/captcha/verify"
    );
    const verifyResult = await verifyResponse.json();
    if (verifyResult.result === "success") {
      const response = await page.waitForResponse(
        "https://user.todesk.com/api/transmit"
      );
      const result = await response.json();
      if (result.code === 200) {
        return result;
      } else {
        throw new ProviderError(undefined, result);
      }
    } else {
      throw new CaptchaIncorrectError(verifyResult.result, verifyResult);
    }
  } finally {
    await page.close();
  }
}
