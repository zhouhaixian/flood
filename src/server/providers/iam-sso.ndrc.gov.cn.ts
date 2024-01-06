import { BrowserManager } from "../browser.js";
import { OCR } from "../ocr.js";
import { CaptchaIncorrectError } from "../provider.error.js";

const url = "https://iam-sso.ndrc.gov.cn:8443/userregist/regist/touser";
export async function iam_sso_ndrc_gov_cn(phone: string) {
  const page = await BrowserManager.newPage(url);

  try {
    await page.type("input#mobileNo", phone);
    const captcha = await page.waitForSelector("img#grImgCode");
    const captchaResult = await OCR.recognize(
      await captcha!.screenshot({ encoding: "base64" })
    );
    await page.type("input#imgCode", captchaResult);
    await page.click("button#getCode");
    const response = await page.waitForResponse(
      "https://iam-sso.ndrc.gov.cn:8443/userregist/regist/sendSmsCode"
    );
    const result = await response.json();

    if (result.success) {
      return result;
    } else if (result.errorCode === "IVLID_PARAM") {
      throw new CaptchaIncorrectError(result.errorMsg, result);
    } else {
      throw new Error(result.errorMsg);
    }
  } finally {
    await page.close();
  }
}
