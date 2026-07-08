import { IExpress } from "./express";
import { IPlugin } from "./pluginsManager";

export interface IBot {
  electron?: {
    appPath: string;
  };
  express?: IExpress
  plugins?: IPlugin;
}

export const iBot: IBot = {};
