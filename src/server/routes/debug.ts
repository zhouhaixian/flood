import { Router } from "express";
import * as providers from "../providers/index.js";
import { Result } from "../result.js";

const router = Router();
router.get("/providers", (_, res) => {
  res.json(Result.success(Object.keys(providers)));
});
router.get("/providers/:provider", async (req, res) => {
  const name = req.params.provider as string;
  const phone = req.query.phone as string;
  // @ts-ignore
  const provider = providers[name];
  if (provider) {
    try {
      const result = await provider(phone);
      res.json(Result.success(result));
    } catch (error: any) {
      res.json(Result.error(721, error.stack));
    }
  } else {
    res.json(Result.error(404, "Provider not found"));
  }
});

export default router;
