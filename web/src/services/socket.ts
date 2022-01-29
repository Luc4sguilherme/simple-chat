import io from 'socket.io-client';

type EventCallback = (data: any) => void;

const HOST = import.meta.env.VITE_SERVER_HOST || 'localhost';
const PORT = import.meta.env.VITE_SERVER_PORT || 3333;

const socket = io(`http://${HOST}:${PORT}`);

function configureBroadcastEvent(callback: EventCallback) {
  socket.on('broadcast', data => callback(data));
}

function configureCountEvent(callback: EventCallback) {
  socket.on('count', data => callback(data));
}

export { socket, configureBroadcastEvent, configureCountEvent };
