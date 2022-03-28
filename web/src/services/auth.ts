import api from './api';

export type UserData = {
  username: string;
  password: string;
};

export type Response = {
  token: string;
  user: UserData;
};

export async function signIn(userData: UserData): Promise<Response> {
  const resp = await api.post('/auth/authenticate', userData);

  return resp.data;
}

export async function signUp(userData: UserData): Promise<Response> {
  const resp = await api.post('/auth/register', userData);

  return resp.data;
}
