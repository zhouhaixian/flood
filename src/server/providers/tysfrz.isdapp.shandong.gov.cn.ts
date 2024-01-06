import { BrowserManager } from "../browser.js";
import { OCR } from "../ocr.js";
import { CaptchaIncorrectError, ProviderError } from "../provider.error.js";

const url =
  "https://tysfrz.isdapp.shandong.gov.cn/jis-web/register?appMark=BEBWKSNVO&userType=1";
export async function tysfrz_isdapp_shandong_gov_cn(phone: string) {
  const page = await BrowserManager.newPage(url);
  try {
    await page.reload({ waitUntil: "networkidle0" });
    await page.waitForSelector("input#mobile", { visible: true });
    await page.type("input#name", "张三");
    await page.type("input#papersNumber", "441521190309268294");
    await page.type("input#mobile", phone);
    await page.type("input[autocomplete='new-password']", "tAx9A4RSTea:j_k");
    await page.type("input#newPasswordRepeat", "tAx9A4RSTea:j_k");
    const captcha = await page.waitForSelector("img.registerImgCaptcha");
    const captchaResult = await OCR.recognize(
      await captcha!.screenshot({ encoding: "base64" })
    );
    page.type("input#imgCode", captchaResult);
    const checkCodeResponse = await page.waitForResponse((res) =>
      res
        .url()
        .startsWith(
          "https://tysfrz.isdapp.shandong.gov.cn/api-gateway/common-captcha-server/interface/code/checkCode"
        )
    );
    const checkCodeResult = await checkCodeResponse.json();
    if (checkCodeResult.success) {
      page.click(
        "#app > div > div > div > div.container-right > div > div:nth-child(3) > form > div:nth-child(8) > div.ant-col.ant-col-16.ant-form-item-control-wrapper > div > span > div > div.ant-col.ant-col-24 > button"
      );
      const response = await page.waitForResponse(
        "https://tysfrz.isdapp.shandong.gov.cn/api-gateway/jpaas-jis-peruser-server/front/persms/send-new-mobilecode"
      );
      const result = await response.json();
      if (result.success) {
        return result;
      } else {
        throw new ProviderError(result.message, result);
      }
    } else {
      throw new CaptchaIncorrectError(checkCodeResult.message, checkCodeResult);
    }
  } finally {
    await page.close();
  }
}
