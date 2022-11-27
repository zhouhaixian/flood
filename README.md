# flood

短信之洪水

## 安装依赖

```bash
yarn install
```

## 配置目标

编辑 `configs/targets.json`

## 禁用 API

编辑 `configs/blacklist.json`

## 开发

### 新增 API

你可以通过 `yarn new <网址> <API名称>` 命令新建 `API模板文件`

该命令还有一个可选参数 `-captcha`, 是否提供该参数取决于是否需要识别验证码, 有无提供该参数将导致生成的文件内容不同

新建的文件将位于 `src/api` 目录下

#### 模板文件内容

无 `-captcha`:

```ts
// url
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();

  const data = (await core
    .post('TODO', {
      TODO,
    })
    .json()) as any;

  if (TODO) {
    return data;
  } else {
    throw new core.APIError(TODO, data);
  }
}
```

有 `-captcha`:

```ts
// url
import { Core } from '../core';

export default async function (target: string) {
  const core = new Core();
  const captcha = await core.verify('TODO');

  const data = (await core
    .post('TODO', {
      TODO,
    })
    .json()) as any;

  if (TODO) {
    return data;
  } else if (TODO) {
    throw new core.CaptchaError(TODO, data);
  } else {
    throw new core.APIError(TODO, data);
  }
}
```

下面是一个例子:

```bash
yarn new https://user.mofcom.gov.cn/registration?siteId=yhdl user.mofcom.gov.cn -captcha
```

### 删除 API

```bash
yarn delete <API名称> # 例如: yarn delete baidu.com
```

### 调试

如果你使用 `VSCode`, 只需打开需要调试的 `API` 文件, 并按下 `F5` 键, 即可开始调试

或者, 你也可以运行 `yarn debug <API名称>`, 即可开始调试, 例如: `yarn debug user.mofcom.gov.cn`

## 运行

```bash
yarn start
```

## 编译

```bash
yarn build
```

编译成功后，可执行文件位于 `dist/bin` 目录下
