import axios from 'axios';

const api = axios.create({
  baseURL: String(import.meta.env.VITE_SERVER_HOST),
});

export default api;
