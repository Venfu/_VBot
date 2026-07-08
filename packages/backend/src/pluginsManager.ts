import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { iBot } from "./ibot";

export interface IPlugin {
  loaded: IPluginLoaded[];
}

interface IPluginLoaded {
  name: string;
  status: string;
}

export const init: () => Promise<IPlugin> = async () => {
  const pluginsDir = path.join(iBot.electron?.appPath || "", "plugins");
  try {
    const entries = await fs.readdir(pluginsDir, { withFileTypes: true });
    const pluginDirs = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    const loaded: IPluginLoaded[] = [];
    for (const name of pluginDirs) {
      const pluginPath = path.join(pluginsDir, name, "index.js");
      try {
        const mod = await import(pathToFileURL(pluginPath).href);
        if (typeof mod.init === "function") {
          await mod.init(iBot);
          loaded.push({ name, status: "loaded" });
        }
      } catch {
        loaded.push({ name, status: "failed" });
      }
    }
    return { loaded: loaded };
  } catch {
    return { loaded: [] };
  }
};
