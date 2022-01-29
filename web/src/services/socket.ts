import io from 'socket.io-client';

type EventCallback = (data: any) => void;

const socket = io('http://localhost:3333');

function configureBroadcastEvent(callback: EventCallback) {
  socket.on('broadcast', data => callback(data));
}

function configureCountEvent(callback: EventCallback) {
  socket.on('count', data => callback(data));
}

export { socket, configureBroadcastEvent, configureCountEvent };
