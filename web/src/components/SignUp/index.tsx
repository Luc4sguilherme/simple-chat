import './style.css';

import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/authContext';
import { useError } from '../../contexts/errorContext';

function SignUp() {
  const { signUp } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setError, clearError } = useError();
  const navigate = useNavigate();

  function clearInput() {
    setUsername('');
    setPassword('');
  }

  function handleSignUp() {
    if (username.trim().length === 0) {
      clearInput();
      return;
    }

    if (password.trim().length === 0) {
      clearInput();
      return;
    }

    signUp({
      username,
      password,
    })
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
      <div className="signup-form">
        <div className="signup-form-group">
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
        <div className="signup-form-group">
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
      <button type="button" className="signup-btn" onClick={handleSignUp}>
        Sign Up
      </button>
    </>
  );
}

export default SignUp;
