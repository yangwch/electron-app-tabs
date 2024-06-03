const electron = require("electron");

if (typeof electron === "string") {
  throw new TypeError("Not running in an Electron environment!");
}

const { env } = process; // eslint-disable-line n/prefer-global/process
const isEnvSet = "ELECTRON_IS_DEV" in env;
const getFromEnv = Number.parseInt(env.ELECTRON_IS_DEV, 10) === 1;

exports.isDev = isEnvSet ? getFromEnv : !electron.app.isPackaged;
