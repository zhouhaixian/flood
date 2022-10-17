import type { AxiosResponse } from 'axios';

export class APIError extends Error {
  constructor(message: string, response: AxiosResponse) {
    super(message);
    this.name = 'APIError';
    this.response = response;
  }

  public response: AxiosResponse;

  public toString() {
    return `${this.message}
    response: ${JSON.stringify(this.response)}`;
  }
}
