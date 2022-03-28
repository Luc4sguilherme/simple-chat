import { useEffect, useRef, useState } from 'react';
import moment from 'moment';

import './style.css';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSocket } from '../../contexts/socketContext';
import { useAuth } from '../../contexts/authContext';
import { useError } from '../../contexts/errorContext';
import ErrorAlert from '../../components/ErrorAlert';

const LIMIT_OF_LENGTH = 35;

interface Message {
  username: string;
  time: string;
  data: string;
}

function App() {
  const [count, setCount] = useState(0);
  const [textAreaValue, setTextAreaValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messageAreaRef = useRef<HTMLDivElement>(null);
  const {
    socket,
    configureBroadcastEvent,
    configureCountEvent,
    configureErrorEvent,
  } = useSocket();
  const { user, signOut } = useAuth();
  const { setError } = useError();

  function clearMessageInput() {
    setTextAreaValue('');
  }

  function getTime() {
    return moment().format('HH:mm');
  }

  function sendMessage() {
    if (textAreaValue.length > 0) {
      const message = {
        username: user?.username,
        time: getTime(),
        data: textAreaValue,
      };

      socket?.emit('message', message);
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

  useEffect(() => {
    checkLimitMessageLength();
  }, [messages]);

  useEffect(() => {
    configureBroadcastEvent((data: Message) => {
      setMessages(messagesState => [...messagesState, data]);

      if (messageAreaRef.current) {
        const element = messageAreaRef.current;
        element.scrollTop = element.scrollHeight;
      }
    });

    configureCountEvent((data: number) => {
      setCount(data);
    });

    configureErrorEvent((data: Error) => {
      setError(data.message);
    });
  }, [socket]);

  return (
    <ErrorAlert>
      <div className="App">
        <div className="header">
          <div id="count">{count} online</div>
          <div className="logged-wrapper">
            <button type="button" className="logout-btn" onClick={signOut}>
              <LogoutIcon />
            </button>
          </div>
        </div>
        <div className="chat">
          <div className="messages-area" ref={messageAreaRef}>
            {messages.map((message, index) => (
              <p className="message" key={index}>
                <span className="date-time">{message.time}</span>{' '}
                <span className="user-name">{message.username}</span>:{' '}
                {message.data}
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
      </div>
    </ErrorAlert>
  );
}

export default App;
