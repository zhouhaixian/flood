import { PrismaClient } from "@prisma/client";

enum Status {
  Success = "success",
  Fail = "fail",
}

export class Logger {
  public static LogTable = class {
    private static readonly prisma = new PrismaClient();
    public static async add(
      status: Status,
      phone: string,
      provider: string,
      message: string,
      stack?: string,
      response?: string
    ) {
      try {
        await this.prisma.logs.create({
          data: {
            status,
            phone,
            provider,
            message,
            stack,
            response,
          },
        });
      } catch (error) {
        console.error(error);
        await this.prisma.$disconnect();
      }
    }
    public static async getLatestByPhone(phone: string) {
      try {
        const log = await this.prisma.logs.findFirst({
          where: {
            phone,
          },
          orderBy: {
            create_at: "desc",
          },
        });
        return log;
      } catch (error) {
        console.error(error);
        await this.prisma.$disconnect();
        return null;
      }
    }
  };

  public static async success(
    phone: string,
    provider: string,
    message = "验证码获取成功",
    response?: string
  ) {
    await this.LogTable.add(
      Status.Success,
      phone,
      provider,
      message,
      undefined,
      response
    );
  }

  public static async fail(
    phone: string,
    provider: string,
    message = "验证码获取失败",
    stack?: string,
    response?: string
  ) {
    await this.LogTable.add(
      Status.Fail,
      phone,
      provider,
      message,
      stack,
      response
    );
  }
}
