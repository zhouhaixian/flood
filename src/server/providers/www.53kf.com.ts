import { BrowserManager } from "../browser.js";
import { ProviderError } from "../provider.error.js";

const url = "https://www.53kf.com/reg/index";
export async function www_53kf_com(phone: string) {
  const page = await BrowserManager.newPage(url);
  try {
    await page.type("input#phone", phone);
    page.click("button.get-yzm");
    const response = await page.waitForResponse(
      "https://www.53kf.com/reg/yz_phone_number"
    );
    const result = await response.json();
    if (result.msg === "验证码发送成功") {
      return result;
    } else {
      throw new ProviderError(result.msg, result);
    }
  } finally {
    await page.close();
  }
}
