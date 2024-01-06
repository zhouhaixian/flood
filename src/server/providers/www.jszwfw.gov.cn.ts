import { BrowserManager } from "../browser.js";
import { OCR } from "../ocr.js";
import { CaptchaIncorrectError, ProviderError } from "../provider.error.js";

const url = "https://www.jszwfw.gov.cn/jsjis/front/register/perregister.do";
export async function www_jszwfw_gov_cn(phone: string) {
  const page = await BrowserManager.newPage(url);

  try {
    await page.type("input#papersNumber", "441521197302158256");
    await page.type("input#mobile", phone);
    const captcha = await page.waitForSelector("img#verifyImg");
    const captchaResult = await OCR.recognize(
      await captcha!.screenshot({ encoding: "base64" })
    );
    await page.type("input#randCode", captchaResult);
    await page.evaluate(() => {
      document.querySelector<HTMLButtonElement>("div#sendMobileCode")!.click();
    });
    const response = await page.waitForResponse(
      "https://www.jszwfw.gov.cn/jsjis/front/register/sendmobilerand.do"
    );
    const result = await response.json();
    if (result.success) {
      return result;
    } else if (result.message === "图片验证码错误") {
      throw new CaptchaIncorrectError(result.message, result);
    } else {
      throw new ProviderError(result.message, result);
    }
  } finally {
    await page.close();
  }
}
