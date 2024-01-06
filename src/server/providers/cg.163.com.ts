import { BrowserManager } from "../browser.js";
import { ProviderError } from "../provider.error.js";

const url = "https://cg.163.com/#/mobile";
export async function cg_163_com(phone: string) {
  const page = await BrowserManager.newPage(url);
  try {
    await page.waitForSelector("div.login-btn div");
    await page.evaluate(() => {
      document.querySelector<HTMLButtonElement>("div.login-btn div")!.click();
    });
    await page.waitForSelector("input[placeholder='请输入手机号码']", {
      visible: true,
    });
    await page.type("input[placeholder='请输入手机号码']", phone);
    await page.click(
      "#app > div.login-confirm.confirm-shade.fadein > div > div.cofirm-cont > div > div > div.login-box.login-phone > div.g-Btn.g-Btn-green2"
    );
    await page.waitForSelector(
      "body > div.confirm-shade.fadein > div > div > div.cofirm-btns.double > a.g-Btn.g-Btn-green2"
    );
    page.click(
      "body > div.confirm-shade.fadein > div > div > div.cofirm-btns.double > a.g-Btn.g-Btn-green2"
    );
    const response = await page.waitForResponse((res) =>
      res.url().startsWith("https://n.cg.163.com/api/v1/phone-captchas")
    );
    if (response.ok()) {
      return {};
    } else {
      const result = await response.json();
      throw new ProviderError(result.errmsgcn, result);
    }
  } finally {
    await page.close();
  }
}
