// @ts-check
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const os = require("node:os");
const sudo = require("sudo-prompt");

const resolveTo = (...args) => path.resolve(__dirname, ...args);
const exeFile = resolveTo("./mkcert-v1.4.4-windows-amd64.exe");
const install = async () => {
  const installRes = spawnSync(exeFile, ["-install"], {
    stdio: "pipe",
  });
  const res1 = String(installRes.stderr);
  if (res1.includes("local CA is already installed")) {
    return res1;
  }
  const res2 = await new Promise((resolve, reject) => {
    sudo.exec(`${exeFile} "-install"`, { name: "mkcert" }, (err, stdout, stderr) => {
      if (err) {
        return reject(err);
      }
      resolve(String(stderr));
    });
  });
  return res2;
};

const gen = async (...args) => {
  const genRes = spawnSync(exeFile, args, {
    stdio: "pipe",
  });
  return genRes.stderr;
};

(async () => {
  if (os.platform() !== "win32") {
    console.error("mkcert no support for you system. install by you self");
    return;
  }
  await install();
  await gen("localhost");
  console.log("mkcert prepare success!");
})();
