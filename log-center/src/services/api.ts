import axios from 'axios';
import type { LogSearchParams, LogResponse } from '../types';

const API_BASE_URL = 'https://oc.imile.com/logcenter';

export const createApiClient = (authorization: string) => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authorization}`,
    },
  });

  return {
    getLogs: async (params: LogSearchParams): Promise<LogResponse> => {
      const response = await client.post('/bizLog/pageOpLogs', params);
      return response.data;
    },
  };
};
