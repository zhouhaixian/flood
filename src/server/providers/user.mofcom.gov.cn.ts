import { BrowserManager } from "../browser.js";
import { OCR } from "../ocr.js";
import { CaptchaIncorrectError, ProviderError } from "../provider.error.js";

const url = "https://user.mofcom.gov.cn/registration?siteId=yhdl";
export async function user_mofcom_gov_cn(phone: string) {
  const page = await BrowserManager.newPage(url);

  try {
    await page.type("input#phone", phone);
    const captcha = await page.waitForSelector("img#img_code");
    const captchaResult = await OCR.recognize(
      await captcha!.screenshot({ encoding: "base64" })
    );
    await page.type("input#imgCodeText", captchaResult);
    await page.evaluate(() =>
      document.querySelector<HTMLButtonElement>("span#sendMsg")!.click()
    );
    const response = await page.waitForResponse(
      "https://user.mofcom.gov.cn/registration/sms/send"
    );
    const result = await response.json();

    if (result.status === "s200") {
      return result;
    } else if (result.msg === "图片验证码填写错误。") {
      throw new CaptchaIncorrectError(result.msg, result);
    } else {
      throw new ProviderError(result.msg, result);
    }
  } finally {
    await page.close();
  }
}
