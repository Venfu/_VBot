import { useEffect, useState } from 'react';

type StatusResponse = {
  ok: boolean;
  stack: string[];
  twitch: {
    connected: boolean;
    channel: string | null;
    username: string | null;
    token: string | null;
  };
};

type EventItem = {
  id: number;
  type: string;
  payload: string;
  createdAt: string;
};

export function App() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [channel, setChannel] = useState('');
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');

  async function refresh() {
    const [statusResponse, eventsResponse] = await Promise.all([
      fetch('/api/status').then((response) => response.json()),
      fetch('/api/twitch/events').then((response) => response.json()),
    ]);
    setStatus(statusResponse);
    setEvents(eventsResponse);
    setChannel(statusResponse.twitch.channel ?? '');
    setUsername(statusResponse.twitch.username ?? '');
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function saveSettings() {
    await fetch('/api/twitch/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, username, token }),
    });
    await refresh();
  }

  async function connect() {
    await fetch('/api/twitch/connect', { method: 'POST' });
    await refresh();
  }

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>_VBot</h1>
      <p>A TypeScript, React and Web Components based Twitch bot framework.</p>

      <section style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h2>Twitch configuration</h2>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <input value={channel} onChange={(event) => setChannel(event.target.value)} placeholder="Channel" style={{ padding: '0.6rem' }} />
          <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Bot username" style={{ padding: '0.6rem' }} />
          <input value={token} onChange={(event) => setToken(event.target.value)} placeholder="OAuth token" style={{ padding: '0.6rem' }} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={saveSettings} style={{ padding: '0.6rem 1rem' }}>Save settings</button>
            <button onClick={connect} style={{ padding: '0.6rem 1rem' }}>Connect</button>
          </div>
        </div>
      </section>

      <section style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h2>Runtime status</h2>
        <pre>{status ? JSON.stringify(status, null, 2) : 'Loading...'}</pre>
      </section>

      <section style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
        <h2>Recent events</h2>
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <strong>{event.type}</strong> {event.createdAt} — {event.payload}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
