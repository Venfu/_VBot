import { IBot } from "./ibot.js";
import path from "path";

const bot: IBot = {};

export default async (electronApp: Electron.App) => {
  bot.electron = {
    appPath: electronApp.isPackaged
      ? path.dirname(electronApp.getPath("exe"))
      : electronApp.getAppPath(),
  };

  (await import("./app.js")).init();
  const loadedPlugins = (await import("./pluginsManager.js")).init(bot);
  console.log(await loadedPlugins);
};
