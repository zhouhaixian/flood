export class APIError extends Error {
  constructor(message: string, response: any) {
    super(message);
    this.name = 'APIError';
    this.response = response;
  }

  public response: any;

  public toString() {
    return `${this.message}
    response: ${JSON.stringify(this.response)}`;
  }
}

export class CaptchaError extends APIError {
  constructor(message: string, response: any) {
    super(message, response);
    this.name = 'CaptchaError';
    this.response = response;
  }

  public response: any;

  public toString() {
    return `${this.message}
    response: ${JSON.stringify(this.response)}`;
  }
}
