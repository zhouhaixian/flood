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

```bash
yarn new <API名称> # 例如: yarn new mog.gov.cn
```

新建的文件位于 `src/api` 目录下

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
