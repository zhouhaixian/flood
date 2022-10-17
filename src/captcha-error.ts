import type { AxiosResponse } from 'axios';
import { APIError } from './api-error';

export class CaptchaError extends APIError {
  constructor(message: string, response: AxiosResponse) {
    super(message, response);
    this.name = 'CaptchaError';
    this.response = response;
  }

  public response: AxiosResponse;

  public toString() {
    return `${this.message}
    response: ${JSON.stringify(this.response)}`;
  }
}
