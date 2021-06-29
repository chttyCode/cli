> 学习开发脚手架

# cli

# monorepo 管理

- [monorepo](https://github.com/chttyCode/KnPoint/blob/master/content/monorepo.md)
- 采用 lerna 管理工具

# lerna

- 初始化

```js
    npx lerna init
```

- package 新增 workspace

```js
{
  "name": "root",
  "private": true, // 避免发包
  "workspaces":[
    "packages/*"
  ],
  "devDependencies": {
    "lerna": "^4.0.0"
  }
}
```

- 创建子项目

```js
npx lerna create create-react-app
npx lerna create cra-template
npx lerna create react-scripts
```

# create-react-app

- 安装根依赖(vs lerna bootstrap:yarn install 等于 lerna bootstrap --npm-client yarn --use-workspaces)

  - yarn add chalk cross-spawn fs-extra --ignore-workspace-root-check

- 安装子项目依赖(package.json=>workspaces 属性)
  - commander
    - yarn workspace create-react-app add commander
    - 参数
      - version 方法可以设置版本，其默认选项为-V 和--version
      - 通过.arguments 可以为最顶层命令指定参数，对子命令而言，参数都包括在.command 调用之中了。尖括号（例如）意味着必选，而方括号（例如[optional]）则代表可选
      - 通过 usage 选项可以修改帮助信息的首行提示
      - action 指定命令的行为
- 开发流程

  - 获取命令行参数
    - action:获取项目名
  - 创建项目

    - 创建目录

    ```js
    fs.ensureDirSync(appName);
    ```

    - 切换工作目录

    ```js
    const root = path.resolve(appName); //获取项目绝对路径
    const originalDirectory = process.cwd(); // 当前执行命令的工作目录
    process.chdir(root); // 改变工作目录为待创建项目的目录
    //root /Users/kong.ds/Documents/person/cli/eg/my-app
    //appName eg/my-app
    //originalDirectory /Users/kong.ds/Documents/person/cli
    ```
