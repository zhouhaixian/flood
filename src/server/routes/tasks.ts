import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { Result } from "../result.js";

const prisma = new PrismaClient();
const router = Router();
router.get("", async (_, res) => {
  try {
    const tasks = await prisma.tasks.findMany({
      orderBy: [
        {
          create_at: "desc",
        },
      ],
    });
    res.json(Result.success(tasks));
  } catch {
    res.status(500).json(Result.error(500, "Internal Server Error"));
    await prisma.$disconnect();
  }
});
router.get("/:phone", async (req, res) => {
  try {
    const { phone } = req.params;
    const task = await prisma.tasks.findUnique({
      where: {
        phone,
      },
    });
    res.json(Result.success(task));
  } catch {
    res.status(500).json(Result.error(500, "Internal Server Error"));
    await prisma.$disconnect();
  }
});
router.post("", async (req, res) => {
  try {
    const { phone, active, intervals, note } = req.body;
    await prisma.tasks.create({
      data: {
        phone,
        active,
        intervals,
        note,
      },
    });
    res.json(Result.success(null));
  } catch {
    await prisma.$disconnect();
    res.status(500).json(Result.error(500, "Internal Server Error"));
  }
});
router.patch("/:phone", async (req, res) => {
  try {
    const { phone } = req.params;
    const { active, intervals, note } = req.body;
    await prisma.tasks.update({
      where: {
        phone,
      },
      data: {
        active,
        intervals,
        note,
      },
    });
    res.json(Result.success(null));
  } catch {
    await prisma.$disconnect();
    res.status(500).json(Result.error(500, "Internal Server Error"));
  }
});
router.delete("/:phone", async (req, res) => {
  try {
    const { phone } = req.params;
    await prisma.tasks.delete({
      where: {
        phone,
      },
    });
    res.json(Result.success(null));
  } catch {
    await prisma.$disconnect();
    res.status(500).json(Result.error(500, "Internal Server Error"));
  }
});
export default router;
