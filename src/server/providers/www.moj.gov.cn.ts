import { BrowserManager } from "../browser.js";
import { OCR } from "../ocr.js";
import { CaptchaIncorrectError, ProviderError } from "../provider.error.js";

const url = "https://www.moj.gov.cn/sfbsso/register.html";
export async function www_moj_gov_cn(phone: string) {
  const page = await BrowserManager.newPage(url);

  try {
    await page.type("input#telephone", phone);
    const captcha = await page.waitForSelector("img#verifyImage");
    const captchaResult = await OCR.recognize(
      await captcha!.screenshot({ encoding: "base64" })
    );
    await page.type("input#registerInput", captchaResult);
    await page.click("div#getCode");

    const response = await page.waitForResponse(
      "https://www.moj.gov.cn/sfbsso/SMS/sendSecurityCode"
    );
    const result = await response.json();
    if (result.success) {
      return result;
    } else if (result.errorMsg === "图片验证码错误") {
      throw new CaptchaIncorrectError(result.errorMsg, result);
    } else {
      throw new ProviderError(result.errorMsg, result);
    }
  } finally {
    await page.close();
  }
}
