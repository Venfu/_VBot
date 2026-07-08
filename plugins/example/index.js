console.log("plugin loaded");

export const init = (bot) => {
  console.log("plugin init()");
  bot.express.addConfig();
  bot.express.addFragment();
  bot.express.addApi();
};
