import express from "express";
import ViteExpress from "vite-express";
import tasksRouter from "./routes/tasks.js";
import logsRouter from "./routes/logs.js";
import debugRouter from "./routes/debug.js";
import { Worker } from "worker_threads";
import { sleep } from "./utils.js";
import { BrowserManager } from "./browser.js";

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use("/api/debug", debugRouter);
  process.on("SIGINT", async () => {
    await BrowserManager.browser.then((browser) => browser.close());
    process.exit();
  });
} else {
  const kernelPath = `${process.cwd()}/src/server/kernel.ts`;
  let kernel = new Worker(kernelPath);
  async function restartKernel() {
    kernel.postMessage("exit");
    kernel.on("message", async (message) => {
      switch (message) {
        case "exited":
          kernel = new Worker(kernelPath);
          console.log("Kernel restarted");
          break;
      }
    });
  }

  app.use("/api", (req, res, next) => {
    sleep(1000).then(async () => {
      switch (req.method) {
        case "POST":
          await restartKernel();
          break;
        case "PATCH":
          await restartKernel();
          break;
        case "DELETE":
          await restartKernel();
          break;
      }
    });
    next();
  });
}

app.use("/api/tasks", tasksRouter);
app.use("/api/logs", logsRouter);

app.get("/hello", (_, res) => {
  res.send("Hello Vite + Vue + TypeScript!");
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
