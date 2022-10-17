import axios, { AxiosRequestConfig } from 'axios';

export default async function (url: string, config?: AxiosRequestConfig<any>) {
  const response = await axios.get(url, {
    ...config,
    responseType: 'arraybuffer',
  });

  return {
    ...response,
    data: Buffer.from(response.data, 'binary'),
  };
}
