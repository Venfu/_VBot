import path from "path";
import { iBot } from "./ibot.js";

export default async (electronApp: Electron.App) => {
  iBot.electron = {
    appPath: electronApp.isPackaged
      ? path.dirname(electronApp.getPath("exe"))
      : electronApp.getAppPath(),
  };

  iBot.express = await (await import("./express.js")).init();
  iBot.plugins = await (await import("./pluginsManager.js")).init();
};
