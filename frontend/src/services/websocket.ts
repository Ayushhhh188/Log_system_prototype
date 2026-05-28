export type LogEntry = {
  timestamp: string;
  level: string;
  component: string;
  message: string;
  type: "normal" | "suspicious" | "critical";
};

type LogCallback = (log: LogEntry) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private listeners: LogCallback[] = [];
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  private isConnecting = false;

  connect() {
    if (this.isConnecting) return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return;

    this.isConnecting = true;
    this.ws = new WebSocket("ws://localhost:8000/ws/logs");

    this.ws.onopen = () => {
      console.log("✅ WebSocket connected");
      this.isConnecting = false;
    };

    this.ws.onmessage = (event) => {
      try {
        const log: LogEntry = JSON.parse(event.data);
        this.listeners.forEach((cb) => cb(log));
      } catch (e) {
        console.error("Failed to parse log message", e);
      }
    };

    this.ws.onclose = () => {
      console.warn("🔌 WebSocket disconnected. Reconnecting...");
      this.isConnecting = false;
      this.reconnectTimeout = setTimeout(() => this.connect(), 3000);
    };

    this.ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      this.isConnecting = false;
      this.ws?.close();
    };
  }

  disconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.ws?.close();
    this.ws = null;
  }

  onLog(callback: LogCallback) {
    this.listeners.push(callback);
  }

  offLog(callback: LogCallback) {
    this.listeners = this.listeners.filter((cb) => cb !== callback);
  }
}

export const wsService = new WebSocketService();