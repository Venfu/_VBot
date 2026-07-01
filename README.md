# \_VBot

## Introduction

\_VBot is a Twitch Bot Framework

\_VBot is a single executable application (Node SEA) that embed tools like for example :

- connect the user to Twitch throw API key
- connect to Twitch chat of the connected user channel (IRC)
- subscribe to Twitch events websockets (Follow, raid, subscription...)
- create a local database
- and more

All these features are clearely separated into modules folder for code comprehension

\_VBot will embed a web server with a frontend application that allow you to :

- configure \_VBot (User's Twitch API Key)
- configure plugins (webcomponent provided by plugins)
- display fragments (webcomponent provided by plugins)

The frontend application will have a navbar with these entries :

- Homepage
- plugins (dropdown)
- Fragments (dropdown)
- Configuration
- About

Fragments are web pages that will be placed into the Twitch Stream via OBS

\_VBot will allow you to create plugins to enhence and customise your bot.

Plugins will be standalone and can be just placed into plugin folder to be execute by \_VBot. \_VBot will scan at startup the plugins folder. Plugins folder will have subdirectory with the name of the plugin. theses subdirectory will have an index.js with init function. init function will have a parametter for interracting with \_VBot features.

Plugins will have webcomponent to design fragments, and administration page.

Plugins creation can be done via frontend via a button in Configuration page if Dev mode option is activated. CLicking the button will ask user the plugin name and will create a plugin skeletton into plugins folder. The skeletton will provide example of webcomponent for configuration, webcomponent for fragment and will have the init function that will be called by \_VBot.

Plugins can interract with \_VBot Database for configuration.

Plugins can interract witch the features that are provided by \_VBot. For example a plugin can read Twitch chat and can send message.

## Tech

- NodeJS
- typescript
- Webcomponents
- SQLite
- React
