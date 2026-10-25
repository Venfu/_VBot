// import fs from "fs";

// export default () => {}

// if (!fs.existsSync("./config.json")) {
//   throw new Error("config.json not found");
// }

// const configFileContent = fs.readFileSync("./config.json", "utf8");

// export let config = JSON.parse(configFileContent);
import dotenv from "dotenv";
import path from "path";

export const init = async (appPath: string) => {
  await dotenv.config({ path: path.join(appPath, ".env") });
};

export const env = process.env;
