import path from "path";
import { iBot } from "./ibot.js";

import "./config.js";
import { env } from "./config.js";

export default async (electronApp: Electron.App) => {
  iBot.electron = {
    appPath: electronApp.isPackaged
      ? path.dirname(electronApp.getPath("exe"))
      : electronApp.getAppPath(),
  };
  await (await import("./config.js")).init(iBot.electron.appPath);
  iBot.express = await (await import("./express.js")).init(env);
  iBot.plugins = await (await import("./pluginsManager.js")).init();
};
