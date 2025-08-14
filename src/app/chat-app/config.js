export const baseUrl = 'http://localhost:5000/api/v1';

export const getWsUrl = () => {
  try {
    const url = new URL(baseUrl);
    const wsProtocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    // If your server exposes a dedicated ws path, change here
    // e.g., `${wsProtocol}//${url.host}/ws`
    return `${wsProtocol}//${url.host}${url.pathname.replace(/\/$/, '')}/ws`;
  } catch (e) {
    // Fallback
    console.error('Error constructing WebSocket URL:', e);
    return 'ws://localhost:5000/api/v1/ws';
  }
};

