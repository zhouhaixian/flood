import { BrowserManager } from "../browser.js";
import { ProviderError } from "../provider.error.js";

const url =
  "https://account.console.wangsu.com/register/register-info?language=zh-cn&service=https%3A%2F%2Fwww.wangsu.com%2Fdocument%2F3126%2F3141&rsr=ws";
export async function account_console_wangsu_com(phone: string) {
  const page = await BrowserManager.newPage(url);

  try {
    await page.type("input[placeholder='请输入手机号']", phone);

    page.click("button.el-button.get-code.el-button--text");
    const response = await page.waitForResponse(
      "https://account.console.wangsu.com/api/console/sms/verification-code?language=zh-cn"
    );
    const result = await response.json();
    if (result.code === "0") {
      return result;
    } else {
      throw new ProviderError(result.message, result);
    }
  } finally {
    await page.close();
  }
}
