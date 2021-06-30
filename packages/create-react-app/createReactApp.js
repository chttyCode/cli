const { Command } = require("commander");
const spawn = require("cross-spawn");
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
  await run(root, appName, originalDirectory);
}

/**
 *
 * @param {*} root 创建的项目的路径 /Users/kong.ds/Documents/person/cli/eg/my-app
 * @param {*} appName 项目名 eg/my-app
 * @param {*} originalDirectory 原来的工作目录  originalDirectory /Users/kong.ds/Documents/person/cli
 */
async function run(root, appName, originalDirectory) {
  let scriptName = "react-scripts"; //create生成的代码里 源文件编译，启动服务放在了react-scripts
  let templateName = "cra-template";
  const allDependencies = ["react", "react-dom", scriptName, templateName];

  await install(root, allDependencies);

  //项目根目录  项目的名字 verbose是否显示详细信息 原始的目录 模板名称cra-template
  let data = [root, appName, true, originalDirectory, templateName];
  let source = `
   var init = require('react-scripts/scripts/init.js');
   init.apply(null, JSON.parse(process.argv[1]));
   `;
  await executeNodeScript({ cwd: process.cwd() }, data, source);
  console.log("Done.");
  process.exit(0);
}

/**
 *
 * @param {*} param0
 * @param {*} data
 * @param {*} source
 */
async function executeNodeScript({ cwd }, data, source) {
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath, //node可执行文件的路径
      ["-e", source, "--", JSON.stringify(data)],
      { cwd, stdio: "inherit" }
    );
    child.on("close", resolve);
  });
}

/**
 *
 * @param {*} root
 * @param {*} allDependencies
 */
async function install(root, allDependencies) {
  return new Promise((resolve) => {
    const command = "yarnpkg";
    const args = ["add", "--exact", ...allDependencies, "--cwd", root];
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("close", resolve);
  });
}
module.exports = {
  init,
};
