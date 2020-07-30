import axios from 'axios';
// eslint-disable-next-line import/no-unresolved
import { API_URL } from '@env';

const api = axios.create({
  baseURL: API_URL,
});

export default api;
