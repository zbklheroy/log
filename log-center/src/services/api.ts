import axios from 'axios';
import type { LogSearchParams, LogResponse } from '../types';

const API_BASE_URL = 'https://oc.imile.com/logcenter';

const getCookie = (name: string): string | null => {
  const cookieString = document.cookie;
  const cookies = cookieString.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
};

export const createApiClient = (authorization?: string) => {
  const token = getCookie('ACCESS_TOKEN') || authorization;
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });

  return {
    getLogs: async (params: LogSearchParams): Promise<LogResponse> => {
      const response = await client.post('/bizLog/pageOpLogs', params);
      return response.data;
    },
  };
};
