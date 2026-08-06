import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

/**
 * Get or create the Socket.io singleton instance.
 * Only initializes on the client side.
 */
export const getSocket = (): Socket | null => {
  if (typeof window === 'undefined') return null;

  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
    });

    socket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed after maximum attempts');
    });
  }

  return socket;
};

/**
 * Connect the socket with an authentication token.
 */
export const connectSocket = (token?: string): void => {
  const s = getSocket();
  if (!s) return;

  if (token) {
    s.auth = { token };
  }

  if (!s.connected) {
    s.connect();
  }
};

/**
 * Disconnect the socket gracefully.
 */
export const disconnectSocket = (): void => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};

/**
 * Subscribe to a socket event.
 */
export const onSocketEvent = (event: string, callback: (...args: unknown[]) => void): void => {
  const s = getSocket();
  if (s) {
    s.on(event, callback);
  }
};

/**
 * Unsubscribe from a socket event.
 */
export const offSocketEvent = (event: string, callback?: (...args: unknown[]) => void): void => {
  const s = getSocket();
  if (s) {
    if (callback) {
      s.off(event, callback);
    } else {
      s.off(event);
    }
  }
};

/**
 * Emit a socket event with data.
 */
export const emitSocketEvent = (event: string, data?: unknown): void => {
  const s = getSocket();
  if (s && s.connected) {
    s.emit(event, data);
  }
};

export default getSocket;
