import { BrowserManager } from "../browser.js";
import { OCR } from "../ocr.js";
import { ProviderError } from "../provider.error.js";

const url = "https://www.bizcn.com/show/userRegister/userRegister.do";
export async function www_bizcn_com(phone: string) {
  const page = await BrowserManager.newPage(url);
  try {
    await page.type("input#mobile1", phone);
    const captcha = await page.waitForSelector("img#id_codeQy");
    const captchaResult = await OCR.recognize(
      await captcha!.screenshot({ encoding: "base64" })
    );
    await page.type("input#check1", captchaResult);
    page.click("input#btn1");
    const response = await page.waitForResponse(
      "https://www.bizcn.com//show/userRegister/sendTellCodeRegister.do"
    );
    const result = await response.json();
    if (result.status === 0) {
      return result;
    } else {
      throw new ProviderError(undefined, result);
    }
  } finally {
    await page.close();
  }
}
