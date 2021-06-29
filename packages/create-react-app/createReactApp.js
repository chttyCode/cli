const { Command } = require("commander");
const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");
const packageJson = require("./package.json");
let appName;
async function init() {
  new Command(packageJson.name)
    .version(packageJson.version)
    .arguments("<project-directory>")
    .usage(`${chalk.green("<project-directory>")} [options]`)
    .action((projectDirectory) => {
      appName = projectDirectory;
    })
    .parse(process.argv);
  await createApp(appName);
}

/**
 * 创建项目
 * @param {*} appName
 */
async function createApp(appName) {
  const root = path.resolve(appName); //获取项目绝对路径
  fs.ensureDirSync(appName); // 确保项目的目录存在，不存在则创建目录
  console.log(`Creating a new React app in ${chalk.green(root)}.`);
  const packageJson = {
    name: appName,
    version: "0.1.0",
    private: true,
  };
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );
  const originalDirectory = process.cwd(); // 当前执行命令的工作目录
  process.chdir(root); // 改变工作目录为待创建项目的目录
}
module.exports = {
  init,
};
