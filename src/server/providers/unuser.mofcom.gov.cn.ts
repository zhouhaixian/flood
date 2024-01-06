import { BrowserManager } from "../browser.js";
import { OCR } from "../ocr.js";
import { CaptchaIncorrectError, ProviderError } from "../provider.error.js";

const url = "https://unuser.mofcom.gov.cn/register";
export async function unuser_mofcom_gov_cn(phone: string) {
  const page = await BrowserManager.newPage(url);

  try {
    await page.type("input#phone", phone);
    await page.click("input#sendPhoneCode");
    const captcha = await page.waitForSelector("img#identifyCode", {
      visible: true,
    });
    const captchaResult = await OCR.recognize(
      await captcha!.screenshot({ encoding: "base64" })
    );
    await page.type("input[name='signYzm']", captchaResult);
    page.click("input[value='确定']");
    const response = await page.waitForResponse(
      "https://unuser.mofcom.gov.cn/registerSendMessageLog"
    );
    const result = await response.json();
    if (result.status === 200) {
      return result;
    } else if (result.msg === "验证码错误") {
      throw new CaptchaIncorrectError(result.msg, result);
    } else {
      throw new ProviderError(result.msg, result);
    }
  } finally {
    await page.close();
  }
}
