import { BrowserManager } from "../browser.js";
import { OCR } from "../ocr.js";
import { ProviderError } from "../provider.error.js";

const url = "https://baodingyun.com.cn/#/login/registerForm";
export async function baodingyun_com_cn(phone: string) {
  const page = await BrowserManager.newPage(url);
  try {
    await page.waitForSelector("input[placeholder='请输入手机号']");
    await page.type("input[placeholder='请输入手机号']", phone);
    const captcha = await page.waitForSelector("img.img-code");
    const captchaResult = await OCR.recognize(
      await captcha!.screenshot({ encoding: "base64" })
    );
    await page.type("input[placeholder='请输入图形验证码']", captchaResult);
    page.evaluate(() => {
      document.querySelector<HTMLButtonElement>("div#getCode")!.click();
    });
    const response = await page.waitForResponse((res) =>
      res.url().startsWith("https://baodingyun.com.cn/api/passLogin/codeVerifi")
    );
    const result = await response.json();
    if (result.msg === "短信验证码发送成功") {
      return result;
    } else {
      throw new ProviderError(result.msg, result);
    }
  } finally {
    await page.close();
  }
}
