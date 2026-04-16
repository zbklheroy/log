export interface LogItem {
  id?: string;
  system?: string;
  mainInfo?: string;
  logContent?: string;
  operationInfo?: string;
  dataSource?: string;
  deviceInfo?: string;
  remark?: string;
  [key: string]: any;
}

export interface LogSearchParams {
  currentPage: number;
  showCount: number;
  search?: string;
  searchType?: string;
  startDate?: string;
  endDate?: string;
  sysName?: string;
  logCategory?: string;
  operationType?: string;
  operationUser?: string;
  menu?: string;
}

export interface LogResponse {
  data: {
    list: LogItem[];
    totalCount: number;
  };
  code: number;
  message: string;
}

export interface AppConfig {
  authorization: string;
  sysName: string;
}
