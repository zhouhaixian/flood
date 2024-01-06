export class Result {
  public code: number;
  public data: any;
  public msg: string;

  constructor(code: number, data: any, msg: string) {
    this.code = code;
    this.data = data;
    this.msg = msg;
  }

  static success(data: any, msg = "success") {
    return new Result(200, data, msg);
  }

  static error(code: number, msg = "error") {
    return new Result(code, null, msg);
  }
}
