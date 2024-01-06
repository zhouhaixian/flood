import puppeteer from "puppeteer-extra";
import { Page } from "puppeteer";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import UserAgent from "user-agents";

// @ts-ignore
puppeteer.use(StealthPlugin());

export class BrowserManager {
  // @ts-ignore
  public static readonly browser = puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
    defaultViewport: {
      height: 1080,
      width: 1920,
    },
    headless: "new",
    // slowMo: process.env.NODE_ENV === "development" ? 100 : undefined,
    // headless: process.env.NODE_ENV === "development" ? false : "new",
    // devtools: process.env.NODE_ENV === "development",
  });
  public readonly page: Page;

  private constructor(page: Page) {
    this.page = page;
  }

  public static async newPage(url: string): Promise<Page> {
    const browser = await this.browser;
    const { page } = new BrowserManager(await browser.newPage());

    // await page.evaluateOnNewDocument(() => {
    //   Object.defineProperty(navigator, "webdriver", {
    //     get: () => false,
    //   });

    //   // @ts-ignore
    //   window.chrome = {};
    //   // @ts-ignore
    //   window.chrome.app = {
    //     InstallState: "hehe",
    //     RunningState: "haha",
    //     getDetails: "xixi",
    //     getIsInstalled: "ohno",
    //   };
    //   // @ts-ignore
    //   window.chrome.csi = function () {};
    //   // @ts-ignore
    //   window.chrome.loadTimes = function () {};
    //   // @ts-ignore
    //   window.chrome.runtime = function () {};

    //   Object.defineProperty(navigator, "userAgent", {
    //     //userAgent在无头模式下有headless字样，所以需覆盖
    //     get: () =>
    //       "Mozilla/5.0 (Windows NT 10.0; WOW64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.5666.197 Safari/537.36",
    //   });

    //   Object.defineProperty(navigator, "plugins", {
    //     //伪装真实的插件信息
    //     get: () => [
    //       {
    //         0: {
    //           type: "application/x-google-chrome-pdf",
    //           suffixes: "pdf",
    //           description: "Portable Document Format",
    //           enabledPlugin: Plugin,
    //         },
    //         description: "Portable Document Format",
    //         filename: "internal-pdf-viewer",
    //         length: 1,
    //         name: "Chrome PDF Plugin",
    //       },
    //       {
    //         0: {
    //           type: "application/pdf",
    //           suffixes: "pdf",
    //           description: "",
    //           enabledPlugin: Plugin,
    //         },
    //         description: "",
    //         filename: "mhjfbmdgcfjbbpaeojofohoefgiehjai",
    //         length: 1,
    //         name: "Chrome PDF Viewer",
    //       },
    //       {
    //         0: {
    //           type: "application/x-nacl",
    //           suffixes: "",
    //           description: "Native Client Executable",
    //           enabledPlugin: Plugin,
    //         },
    //         1: {
    //           type: "application/x-pnacl",
    //           suffixes: "",
    //           description: "Portable Native Client Executable",
    //           enabledPlugin: Plugin,
    //         },
    //         description: "",
    //         filename: "internal-nacl-plugin",
    //         length: 2,
    //         name: "Native Client",
    //       },
    //     ],
    //   });

    //   Object.defineProperty(navigator, "languages", {
    //     //添加语言
    //     get: () => ["zh-CN", "zh", "en"],
    //   });

    //   const originalQuery = window.navigator.permissions.query; //notification伪装
    //   window.navigator.permissions.query = (parameters) =>
    //     // @ts-ignore
    //     parameters.name === "notifications"
    //       ? Promise.resolve({ state: Notification.permission })
    //       : originalQuery(parameters);

    //   // @ts-ignore
    //   const getParameter = WebGLRenderingContext.getParameter;
    //   WebGLRenderingContext.prototype.getParameter = function (parameter) {
    //     // UNMASKED_VENDOR_WEBGL
    //     if (parameter === 37445) {
    //       return "Intel Inc.";
    //     }
    //     // UNMASKED_RENDERER_WEBGL
    //     if (parameter === 37446) {
    //       return "Intel(R) Iris(TM) Graphics 6100";
    //     }
    //     return getParameter(parameter);
    //   };
    // });

    const userAgent = new UserAgent({ deviceCategory: "desktop" });
    await page.setUserAgent(userAgent.random().toString());
    page.on("dialog", (dialog) => dialog.dismiss());
    await page.goto(url, { timeout: 30 * 1000 });
    return page;
  }
}
