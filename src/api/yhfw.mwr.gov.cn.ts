import NodeRSA from 'node-rsa';
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();
  const headers = {
    accept: 'application/json, text/javascript, */*; q=0.01',
    'accept-language': 'zh-CN,zh;q=0.9',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Referer: 'http://yhfw.mwr.gov.cn:8050/tacs-uc/naturalMan/register',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  const data = (await core
    .post('http://yhfw.mwr.gov.cn:8050/tacs-uc/naturalMan/mobileSendWithCode', {
      headers,
      body: `mobile=${encodeURIComponent(encrypt(target))}`,
    })
    .json()) as any;

  if (data.success) {
    return data;
  } else {
    throw new core.APIError(data.msg, data);
  }
}

function encrypt(content: string) {
  const publicKey =
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsgDq4OqxuEisnk2F0EJFmw4xKa5IrcqEYHvqxPs2CHEg2kolhfWA2SjNuGAHxyDDE5MLtOvzuXjBx/5YJtc9zj2xR/0moesS+Vi/xtG1tkVaTCba+TV+Y5C61iyr3FGqr+KOD4/XECu0Xky1W9ZmmaFADmZi7+6gO9wjgVpU9aLcBcw/loHOeJrCqjp7pA98hRJRY+MML8MK15mnC4ebooOva+mJlstW6t/1lghR8WNV8cocxgcHHuXBxgns2MlACQbSdJ8c6Z3RQeRZBzyjfey6JCCfbEKouVrWIUuPphBL3OANfgp0B+QG31bapvePTfXU48TYK0M5kE+8LgbbWQIDAQAB';

  const nodeRSA = new NodeRSA(publicKey, 'pkcs8-public');
  nodeRSA.setOptions({ encryptionScheme: 'pkcs1' });
  return nodeRSA.encrypt(content).toString('base64');
}
