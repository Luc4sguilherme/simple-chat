import { useEffect, useRef, useState } from 'react';
import moment from 'moment';

import {
  socket,
  configureBroadcastEvent,
  configureCountEvent,
} from './services/socket';

import './App.css';

const LIMIT_OF_LENGTH = 35;

function App() {
  const [count, setCount] = useState(0);
  const [textAreaValue, setTextAreaValue] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const messageAreaRef = useRef<HTMLDivElement>(null);

  function clearMessageInput() {
    setTextAreaValue('');
  }

  function sendMessage() {
    if (textAreaValue.length > 0) {
      socket.emit('message', textAreaValue);
    }
  }

  function sendMessageKeyboard(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (event.key === 'Enter') {
      event.preventDefault();

      sendMessage();
      clearMessageInput();
    }
  }

  function sendMessageButton(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    event.preventDefault();

    sendMessage();
    clearMessageInput();
  }

  function checkLimitMessageLength() {
    if (messages.length > LIMIT_OF_LENGTH) {
      setMessages(messagesState => [...messagesState.slice(-LIMIT_OF_LENGTH)]);
    }
  }

  function getTime() {
    return moment().format('HH:MM');
  }

  useEffect(() => {
    checkLimitMessageLength();
  }, [messages]);

  useEffect(() => {
    configureBroadcastEvent((data: string) => {
      setMessages(messagesState => [...messagesState, data]);

      if (messageAreaRef.current) {
        const element = messageAreaRef.current;
        element.scrollTop = element.scrollHeight;
      }
    });

    configureCountEvent((data: number) => {
      setCount(data);
    });
  }, []);

  return (
    <div className="App">
      <div className="chat">
        <div className="messages-area" ref={messageAreaRef}>
          {messages.map((message, index) => (
            <p className="message" key={index}>
              <span className="date-time">{getTime()}</span> - {message}
            </p>
          ))}
        </div>
        <div className="input-wrapper">
          <textarea
            name="message-input"
            className="message-input"
            placeholder="Send a mensage"
            onKeyDown={event => sendMessageKeyboard(event)}
            onChange={event => setTextAreaValue(event.target.value)}
            value={textAreaValue}
          />
          <button
            type="button"
            className="send-btn"
            onClick={event => sendMessageButton(event)}
          >
            Send
          </button>
        </div>
      </div>
      <div id="count">{count} online</div>
    </div>
  );
}

export default App;
