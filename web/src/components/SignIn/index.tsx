import './style.css';

import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/authContext';
import { useError } from '../../contexts/errorContext';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const { setError, clearError } = useError();
  const navigate = useNavigate();

  function clearInput() {
    setUsername('');
    setPassword('');
  }

  function handleSignIn() {
    if (username.trim().length === 0) {
      clearInput();
      return;
    }

    if (password.trim().length === 0) {
      clearInput();
      return;
    }

    signIn({ username, password })
      .then(() => {
        clearInput();
        clearError();
        navigate('/');
      })
      .catch(error => {
        clearInput();

        if (axios.isAxiosError(error)) {
          if (error.response) {
            setError(error.response?.data.error);
          } else {
            setError(error.message);
          }
        } else if (error instanceof Error) {
          setError(error.message);
        }
      });
  }

  return (
    <>
      <div className="signin-form">
        <div className="signin-form-group">
          <input
            type="text"
            name="username"
            id="username"
            onChange={event => {
              setUsername(event.target.value);
            }}
            placeholder="Username"
            value={username}
          />
        </div>
        <div className="signin-form-group">
          <input
            type="password"
            name="password"
            id="password"
            onChange={event => {
              setPassword(event.target.value);
            }}
            placeholder="Password"
            value={password}
          />
        </div>
      </div>
      <button type="button" className="signin-btn" onClick={handleSignIn}>
        Sign In
      </button>
    </>
  );
}

export default SignIn;
