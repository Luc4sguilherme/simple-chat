import { createContext, useState, useEffect, useContext, useMemo } from 'react';

import useLocalStorage from '../hooks/useLocalStorage';
import api from '../services/api';
import * as auth from '../services/auth';

interface User {
  username: string;
  password: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  storagedToken: string;
  signIn(userData: User): Promise<void>;
  signOut(): void;
  signUp(userData: User): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

type AuthProviderProps = {
  children: JSX.Element;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const [storagedUser, setStoragedUser] = useLocalStorage(`user`, null);
  const [storagedToken, setStoragedToken] = useLocalStorage(`token`, null);

  function loadStorageData() {
    if (storagedUser && storagedToken) {
      api.defaults.headers.common.Authorization = `Bearer ${storagedToken}`;

      setUser(() => JSON.parse(storagedUser));
    }
  }

  useEffect(() => {
    loadStorageData();
  }, []);

  async function signIn(userData: User) {
    const response = await auth.signIn(userData);

    setUser(response.user);

    api.defaults.headers.common.Authorization = `Bearer ${response.token}`;

    setStoragedUser(JSON.stringify(response.user));
    setStoragedToken(response.token);
  }

  async function signUp(userData: User) {
    const response = await auth.signUp(userData);

    setUser(response.user);

    api.defaults.headers.common.Authorization = `Bearer ${response.token}`;

    setStoragedUser(JSON.stringify(response.user));
    setStoragedToken(response.token);
  }

  function signOut() {
    setStoragedUser(null);
    setStoragedToken(null);
    setUser(null);
  }

  const memoizedValue = useMemo(
    () => ({
      signed: Boolean(storagedToken),
      user,
      storagedToken,
      signIn,
      signUp,
      signOut,
    }),
    [user, storagedToken],
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
