// https://sfrz.zwfw.hlj.gov.cn/f/wzgruser/wzNaturalPerson/fromgr?uuid=0451hljszfwyhzx001&rediskey=606ea58c66e44392b7a6fa69dbcbd153
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .get('https://sfrz.zwfw.hlj.gov.cn/f/wzuser/sysUser/getMessage', {
      searchParams: {
        mobile: encode64(target),
        _: new Date().getTime().toString(),
      },
    })
    .json()) as any;

  if (data.resuit === '1') {
    return data;
  } else {
    throw new core.APIError(data.resuit, data);
  }
}

function encode64(input: string) {
  const keyStr =
    'ABCDEFGHIJKLMNOP' +
    'QRSTUVWXYZabcdef' +
    'ghijklmnopqrstuv' +
    'wxyz0123456789+/' +
    '=';
  let output = '';
  let chr1,
    chr2,
    chr3: any = '';
  let enc1,
    enc2,
    enc3,
    enc4: any = '';
  let i = 0;
  do {
    chr1 = input.charCodeAt(i++);
    chr2 = input.charCodeAt(i++);
    chr3 = input.charCodeAt(i++);
    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;
    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output =
      output +
      keyStr.charAt(enc1) +
      keyStr.charAt(enc2) +
      keyStr.charAt(enc3) +
      keyStr.charAt(enc4);
    chr1 = chr2 = chr3 = '';
    enc1 = enc2 = enc3 = enc4 = '';
  } while (i < input.length);
  return output;
}
