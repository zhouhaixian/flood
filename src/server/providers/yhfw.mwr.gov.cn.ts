import { BrowserManager } from "../browser.js";
import { ProviderError } from "../provider.error.js";

const url = "http://yhfw.mwr.gov.cn:8050/tacs-uc/naturalMan/register";
export async function yhfw_mwr_gov_cn(phone: string) {
  const page = await BrowserManager.newPage(url);

  try {
    await page.type("input.txt.phone", phone);
    await page.click("#btnSendCode");

    const response = await page.waitForResponse(
      "http://yhfw.mwr.gov.cn:8050/tacs-uc/naturalMan/mobileSendWithCode"
    );
    const result = await response.json();
    if (result.success) {
      return result;
    } else {
      throw new ProviderError(result.msg, result);
    }
  } finally {
    await page.close();
  }
}
