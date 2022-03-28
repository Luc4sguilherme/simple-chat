import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from './authContext';

type EventCallback = (data: any) => void;

interface SocketContextData {
  socket: Socket | undefined;
  configureBroadcastEvent: (callback: EventCallback) => void;
  configureCountEvent: (callback: EventCallback) => void;
  configureErrorEvent: (callback: EventCallback) => void;
}

type SocketProviderProps = {
  children: JSX.Element;
};

const SocketContext = createContext<SocketContextData>({} as SocketContextData);

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket>();
  const { storagedToken } = useAuth();

  useEffect(() => {
    let client: Socket;

    if (storagedToken) {
      client = io(String(import.meta.env.VITE_SERVER_HOST), {
        transports: ['websocket', 'polling', 'flashsocket'],
        auth: {
          token: `Bearer ${storagedToken}`,
        },
      });
      setSocket(client);
    }

    return () => {
      if (client) {
        client.close();
      }
    };
  }, [storagedToken]);

  function configureBroadcastEvent(callback: EventCallback) {
    socket?.on('broadcast', data => callback(data));
  }

  function configureCountEvent(callback: EventCallback) {
    socket?.on('count', data => callback(data));
  }

  function configureErrorEvent(callback: EventCallback) {
    socket?.on('connect_error', data => callback(data));
    socket?.on('message', data => callback(data));
  }

  const memoizedValue = useMemo(
    () => ({
      socket,
      configureBroadcastEvent,
      configureCountEvent,
      configureErrorEvent,
    }),
    [socket, configureBroadcastEvent, configureCountEvent],
  );

  return (
    <SocketContext.Provider value={memoizedValue}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  return context;
}
