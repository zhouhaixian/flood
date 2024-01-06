import { BrowserManager } from "../browser.js";
import { OCR } from "../ocr.js";
import { ProviderError } from "../provider.error.js";

const url =
  "https://sfrz.zwfw.hlj.gov.cn/sfrz/f/apploginuser/appsysuser/apploginfrom?uuid=0451hljszfwyhzx001&rediskey=e2ddf319ec444d178c6ffc34d719b4c7";
export async function sfrz_zwfw_hlj_gov_cn(phone: string) {
  const page = await BrowserManager.newPage(url);
  try {
    await page.type("input#mobile", phone);
    const captcha = await page.waitForSelector("img.yzmtu.validateCode");
    const captchaResult = await OCR.recognize(
      await captcha!.screenshot({ encoding: "base64" })
    );
    await page.type("input#validateCode2", captchaResult);
    page.click("button#sendMobileCode");
    const response = await page.waitForResponse((res) =>
      res
        .url()
        .startsWith(
          "https://sfrz.zwfw.hlj.gov.cn/sfrz/f/wzuser/sysUser/getMessage"
        )
    );
    const result = await response.json();
    if (result.resuit === "1") {
      return result;
    } else {
      throw new ProviderError(undefined, result);
    }
  } finally {
    await page.close();
  }
}
