export class ProviderError extends Error {
  constructor(message = "验证码获取失败", response: any) {
    super(message);
    this.name = ProviderError.name;
    this.response = response;
  }

  public response: any;

  public toString() {
    return `${this.message}\n${this.response}`;
  }
}

export class CaptchaIncorrectError extends ProviderError {
  constructor(message = "图形验证码错误", response: any) {
    super(message, response);
    this.name = CaptchaIncorrectError.name;
  }
}
