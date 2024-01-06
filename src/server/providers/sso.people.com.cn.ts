import { BrowserManager } from "../browser.js";
import { OCR } from "../ocr.js";
import { CaptchaIncorrectError, ProviderError } from "../provider.error.js";

const url = "https://sso.people.com.cn/u/reg?appCode=ENw9NE44";
export async function sso_people_com_cn(phone: string) {
  const page = await BrowserManager.newPage(url);

  try {
    await page.type("input#phoneNum", phone);
    await page.evaluate(() => {
      document.querySelector<HTMLButtonElement>("span.btn_getCode")!.click();
    });
    const captcha = await page.waitForSelector("img#vercodeimg", {
      visible: true,
    });
    const captchaResult = await OCR.recognize(
      await captcha!.screenshot({ encoding: "base64" })
    );
    await page.type("input#verCode", captchaResult);
    page.evaluate(() => {
      document.querySelector<HTMLButtonElement>("span.mL20.yzbtn")!.click();
    });
    const response = await page.waitForResponse(
      "https://sso.people.com.cn/u/reg/sendPhoneCode2"
    );
    const result = await response.json();
    if (result.result === "success") {
      return result;
    } else if (result.errorMsg === "验证码输入有误") {
      throw new CaptchaIncorrectError(result.errorMsg, result);
    } else {
      throw new ProviderError(result.result, result);
    }
  } finally {
    await page.close();
  }
}
