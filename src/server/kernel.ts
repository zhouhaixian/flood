import { PrismaClient } from "@prisma/client";
import * as providers from "./providers/index.js";
import { getUrl, sleep } from "./utils.js";
import { Logger } from "./logger.js";
import { AxiosError } from "axios";
import { CaptchaIncorrectError, ProviderError } from "./provider.error.js";
import { BrowserManager } from "./browser.js";
import { isMainThread, parentPort } from "worker_threads";

(async () => {
  const prisma = new PrismaClient();

  if (!isMainThread) {
    parentPort!.on("message", async (message) => {
      switch (message) {
        case "exit":
          await BrowserManager.browser.then((browser) => browser.close());
          await prisma.$disconnect();
          parentPort!.postMessage("exited");
          process.exit();
      }
    });
  }

  try {
    const tasks = await prisma.tasks.findMany({
      where: {
        active: true,
      },
    });
    (async () => {
      for (const task of tasks) {
        let lastLog = await Logger.LogTable.getLatestByPhone(task.phone);
        new Promise(async () => {
          while (true) {
            let count = 0; // 防止因找不到匹配的provider而无限循环
            for (const provider of Object.values(providers)) {
              if (lastLog !== null && count < 1024) {
                if (lastLog.provider === getUrl(provider)) {
                  lastLog = null;
                }
                count++;
                continue;
              }
              (async function execute() {
                try {
                  const result = await provider(task.phone);
                  await Logger.success(
                    task.phone,
                    getUrl(provider),
                    undefined,
                    JSON.stringify(result, null, 4)
                  );
                } catch (error: any) {
                  if (error instanceof CaptchaIncorrectError) {
                    await Logger.fail(
                      task.phone,
                      getUrl(provider),
                      error.message,
                      error.stack,
                      JSON.stringify(error.response, null, 4)
                    );
                    sleep(5000).then(execute);
                  } else if (error instanceof ProviderError) {
                    await Logger.fail(
                      task.phone,
                      getUrl(provider),
                      error.message,
                      error.stack,
                      JSON.stringify(error.response, null, 4)
                    );
                  } else if (error instanceof AxiosError) {
                    await Logger.fail(
                      task.phone,
                      getUrl(provider),
                      error.message,
                      error.stack,
                      JSON.stringify(error.response?.data, null, 4)
                    );
                  } else {
                    await Logger.fail(
                      task.phone,
                      getUrl(provider),
                      error.message,
                      error.stack
                    );
                  }
                }
              })();
              await sleep(task.intervals);
            }
          }
        });
        await sleep(61000); //TODO: make this configurable
      }
    })();
  } catch (error) {
    await prisma.$disconnect();
    console.error(error);
  }
})();
