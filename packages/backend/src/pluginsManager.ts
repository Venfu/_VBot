import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { IBot } from "./ibot";

export const init = async (bot: IBot) => {
  const pluginsDir = path.join(bot.electron?.appPath || "", "plugins");
  try {
    const entries = await fs.readdir(pluginsDir, { withFileTypes: true });
    const pluginDirs = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    const loaded = [];
    for (const name of pluginDirs) {
      const pluginPath = path.join(pluginsDir, name, "index.js");
      try {
        const mod = await import(pathToFileURL(pluginPath).href);
        if (typeof mod.init === "function") {
          await mod.init(bot);
          loaded.push({ name, status: "loaded" });
        }
      } catch {
        loaded.push({ name, status: "failed" });
      }
    }

    return loaded;
  } catch {
    return [];
  }
};
