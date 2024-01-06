import { BrowserManager } from "../browser.js";
import { solveSlider } from "../utils.js";

const url =
  "https://my.cnki.net/Register/CommonRegister.aspx?returnUrl=https://www.cnki.net";
export async function my_cnki_net(phone: string) {
  const page = await BrowserManager.newPage(url);

  try {
    await page.type("input#txtMobile", phone);

    await solveSlider("span#nc_2_n1z", "div#nc_2__scale_text", page);

    await page.waitForSelector("input#smsbtn", { visible: true });
    await page.click("input#smsbtn");
    return "验证码可能已发送，但是无法确认。";
  } finally {
    await page.close();
  }
}
