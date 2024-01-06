import { BrowserManager } from "../browser.js";
import { OCR } from "../ocr.js";
import { CaptchaIncorrectError, ProviderError } from "../provider.error.js";

const url = "https://user.www.gov.cn/user/reg";
export async function user_www_gov_cn(phone: string) {
  const page = await BrowserManager.newPage(url);

  try {
    await page.reload({ waitUntil: "networkidle0" });
    await page.type("input#phonenum", phone);

    const captcha = await page.waitForSelector("img#piccodeimg");
    const captchaResult = await OCR.recognize(
      await captcha!.screenshot({ encoding: "base64" })
    );
    await page.focus("input#piccode");
    await page.type("input#piccode", captchaResult);
    page.focus("input#sendcode");

    const checkResponse = await page.waitForResponse(
      "https://user.www.gov.cn/user/checkpiccode"
    );
    const checkResult = await checkResponse.json();
    if (checkResult.code === "0") {
      page.click("input#sendcode");
      const response = await page.waitForResponse(
        "https://user.www.gov.cn/user/regsendcode"
      );
      const result = await response.json();
      if (result.code === "0") {
        return result;
      } else if (result.code === "regSendcode_mobilephone_exist") {
        const iframeHandle = await page.waitForSelector(
          "div.easyDialog_text div iframe"
        );
        const frame = await iframeHandle!.contentFrame();
        await frame.waitForSelector("span#getmobile-start");
        await frame.evaluate(() => {
          document
            .querySelector<HTMLButtonElement>("span#getmobile-start")!
            .click();
        });
        await frame.waitForSelector("input#sendcode");
        await frame.click("input#sendcode");
        const response = await page.waitForResponse(
          "https://user.www.gov.cn/user/getmobileSendcode"
        );
        const result = await response.json();
        if (result.code === "0") {
          return result;
        } else {
          throw new ProviderError(result.desc, result);
        }
      } else {
        throw new ProviderError(result.desc, result);
      }
    } else if (checkResult.code === "index_login_01") {
      throw new CaptchaIncorrectError(checkResult.msg, checkResult);
    } else {
      throw new ProviderError(checkResult.desc, checkResult);
    }
  } finally {
    await page.close();
  }
}
