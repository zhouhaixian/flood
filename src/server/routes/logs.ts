import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { Result } from "../result.js";

const prisma = new PrismaClient();
const router = Router();
router.get("/count/:phone", async (req, res) => {
  try {
    const { phone } = req.params;
    const requests = await prisma.logs.count({
      where: {
        phone,
      },
    });
    const sms = await prisma.logs.count({
      where: {
        phone,
        status: "success",
      },
    });
    const errors = await prisma.logs.count({
      where: {
        phone,
        status: "fail",
      },
    });
    res.json(Result.success({ requests, sms, errors }));
  } catch {
    res.status(500).json(Result.error(500, "Internal Server Error"));
    await prisma.$disconnect();
  }
});
router.get("/:phone", async (req, res) => {
  try {
    const { phone } = req.params;
    const result = await prisma.logs.findMany({
      where: {
        phone,
      },
      select: {
        create_at: true,
        status: true,
        phone: true,
        provider: true,
        message: true,
        stack: true,
        response: true,
      },
      orderBy: [
        {
          create_at: "desc",
        },
      ],
      take: 50000,
    });
    res.json(Result.success(result));
  } catch {
    res.status(500).json(Result.error(500, "Internal Server Error"));
    await prisma.$disconnect();
  }
});

export default router;
