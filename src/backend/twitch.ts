import { createDatabase, getSetting, listEvents, logEvent, setSetting } from './database.js';

export type BotState = {
  client: string | null;
  connected: boolean;
  channel: string | null;
  username: string | null;
  token: string | null;
};

export function createTwitchService(db = createDatabase()) {
  const state: BotState = {
    client: null,
    connected: false,
    channel: getSetting(db, 'twitch.channel'),
    username: getSetting(db, 'twitch.username'),
    token: getSetting(db, 'twitch.token'),
  };

  async function connect() {
    if (!state.username || !state.token) {
      logEvent(db, 'connect_failed', { reason: 'missing credentials' });
      return null;
    }

    state.client = 'simulated-client';
    state.connected = true;
    logEvent(db, 'connected', { channel: state.channel, username: state.username });
    return state.client;
  }

  async function disconnect() {
    state.client = null;
    state.connected = false;
    logEvent(db, 'disconnected', { channel: state.channel });
  }

  function updateSettings(next: Partial<{ channel: string; username: string; token: string }>) {
    if (next.channel !== undefined) {
      state.channel = next.channel;
      setSetting(db, 'twitch.channel', next.channel);
    }
    if (next.username !== undefined) {
      state.username = next.username;
      setSetting(db, 'twitch.username', next.username);
    }
    if (next.token !== undefined) {
      state.token = next.token;
      setSetting(db, 'twitch.token', next.token);
    }
  }

  async function sendMessage(message: string) {
    if (!state.connected || !state.channel) {
      return false;
    }
    logEvent(db, 'sent', { channel: state.channel, message });
    return true;
  }

  return {
    connect,
    disconnect,
    updateSettings,
    sendMessage,
    getState: () => ({ ...state, token: state.token ? '***' : null }),
    getEvents: () => listEvents(db),
    getSettings: () => ({
      channel: state.channel,
      username: state.username,
      token: state.token ? '***' : null,
    }),
  };
}
