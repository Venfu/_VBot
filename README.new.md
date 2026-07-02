# _VBot

## Introduction

_VBot is a Twitch Bot Framework.

It is designed as a single executable application that bundles:

- Twitch API and chat integration
- Twitch event subscriptions
- a local SQLite database
- a web UI for configuration and plugin management
- plugin support via isolated modules

The frontend exposes a navbar with:

- Homepage
- Plugins
- Fragments
- Configuration
- About

## Tech

- Node.js
- TypeScript
- React
- Web Components
- SQLite
- Windows executable packaging

## Build

Run the following commands:

```bash
npm install
npm run build
npm run build:exe
```

The build produces a Windows executable at dist/vbot.exe.
