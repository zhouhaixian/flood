import { BrowserManager } from "../browser.js";
import { ProviderError } from "../provider.error.js";
import { solveSlider } from "../utils.js";

const url = "https://user.ihuyi.com/new/register.html";
export async function user_ihuyi_com(phone: string) {
  const page = await BrowserManager.newPage(url);

  try {
    await page.type("input[name='mobile']", phone);
    await solveSlider("span#nc_1_n1z", "span.nc-lang-cnt", page);
    page.click("button.login-btn.login-btn__varicode");
    const response = await page.waitForResponse(
      "https://user.ihuyi.com/new/api/home/safe/reg_sendsms"
    );
    const result = await response.json();

    if (result.message === "发送成功") {
      return result;
    } else {
      throw new ProviderError(result.message, result);
    }
  } finally {
    await page.close();
  }
}
