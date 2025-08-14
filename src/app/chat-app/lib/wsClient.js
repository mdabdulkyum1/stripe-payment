import { getWsUrl } from "../config";

export class ChatSocket {
  constructor({ onOpen, onClose, onError, onMessage }) {
    this.url = getWsUrl();
    this.ws = null;
    this.onOpen = onOpen;
    this.onClose = onClose;
    this.onError = onError;
    this.onMessage = onMessage;
    this.reconnectDelay = 1000;
    this.maxDelay = 10000;
    this.pingInterval = null;
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.addEventListener('open', () => {
      this.reconnectDelay = 1000;
      this.onOpen?.();
      this.pingInterval = setInterval(() => {
        this.send({ type: 'ping' });
      }, 25000);
    });

    this.ws.addEventListener('close', () => {
      this.onClose?.();
      if (this.pingInterval) clearInterval(this.pingInterval);
      setTimeout(() => this.connect(), this.reconnectDelay);
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxDelay);
    });

    this.ws.addEventListener('error', (e) => {
      this.onError?.(e);
    });

    this.ws.addEventListener('message', (ev) => {
      try {
        const data = JSON.parse(ev.data);
        this.onMessage?.(data);
      } catch (e) {
        console.warn('Non-JSON ws message', ev.data, e);
      }
    });
  }

  send(payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  setTyping(roomId, isTyping, user) {
    this.send({ type: 'typing', roomId, isTyping, user });
  }

  sendMessage(roomId, message) {
    this.send({ type: 'message', roomId, message });
  }

  deleteMessage(roomId, messageId) {
    this.send({ type: 'delete', roomId, messageId });
  }
}

