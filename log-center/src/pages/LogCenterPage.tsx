import React, { useState, useEffect } from 'react';
import { Layout, Form, Input, DatePicker, Select, Button, Table, Pagination, Space, message, Card, Typography } from 'antd';
import { SearchOutlined, ReloadOutlined, ExportOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { createApiClient } from '../services/api';
import type { LogItem, LogSearchParams } from '../types';
import { getConfig, clearConfig, highlightText } from '../utils';

const { Header, Content } = Layout;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title } = Typography;

const LogCenterPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [config, setConfig] = useState<{ authorization: string; sysName: string } | null>(null);

  useEffect(() => {
    const savedConfig = getConfig();
    if (!savedConfig) {
      navigate('/');
      return;
    }
    setConfig(savedConfig);
    
    const today = dayjs();
    const startOfDay = today.startOf('day');
    const endOfDay = today.endOf('day');
    
    form.setFieldsValue({
      dateRange: [startOfDay, endOfDay],
    });
  }, [navigate, form]);

  const fetchLogs = async (params: Partial<LogSearchParams> = {}) => {
    if (!config) return;
    
    setLoading(true);
    try {
      const apiClient = createApiClient(config.authorization);
      const dateRange = form.getFieldValue('dateRange') as [Dayjs, Dayjs] | undefined;
      
      const searchParams: LogSearchParams = {
        currentPage: currentPage,
        showCount: pageSize,
        sysName: config.sysName,
        search: form.getFieldValue('search') || '',
        searchType: '2',
        startDate: dateRange ? dateRange[0].format('YYYY-MM-DD HH:mm:ss') : undefined,
        endDate: dateRange ? dateRange[1].format('YYYY-MM-DD HH:mm:ss') : undefined,
        logCategory: form.getFieldValue('logCategory'),
        operationType: form.getFieldValue('operationType'),
        operationUser: form.getFieldValue('operationUser'),
        menu: form.getFieldValue('menu'),
        ...params,
      };

      setSearchKeyword(searchParams.search || '');
      
      const response = await apiClient.getLogs(searchParams);
      if (response.code === 200 || response.code === 0) {
        setLogs(response.data.list || []);
        setTotal(response.data.totalCount || 0);
      } else {
        message.error(response.message || '获取日志失败');
      }
    } catch (error: any) {
      console.error('获取日志失败:', error);
      message.error(error.message || '获取日志失败，请检查网络连接或Authorization');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchLogs({ currentPage: 1 });
  };

  const handleReset = () => {
    const today = dayjs();
    form.resetFields();
    form.setFieldsValue({
      dateRange: [today.startOf('day'), today.endOf('day')],
    });
    setCurrentPage(1);
    setSearchKeyword('');
    fetchLogs({ currentPage: 1 });
  };

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size && size !== pageSize) {
      setPageSize(size);
    }
    fetchLogs({ currentPage: page, showCount: size || pageSize });
  };

  const handleLogout = () => {
    clearConfig();
    navigate('/');
  };

  const handleExport = () => {
    message.info('导出功能待实现');
  };

  const columns = [
    {
      title: '系统',
      dataIndex: 'system',
      key: 'system',
      width: 80,
      render: (text: string) => highlightAndRender(text, searchKeyword),
    },
    {
      title: '主要信息',
      dataIndex: 'mainInfo',
      key: 'mainInfo',
      width: 200,
      render: (text: string) => highlightAndRender(text, searchKeyword),
    },
    {
      title: '日志内容',
      dataIndex: 'logContent',
      key: 'logContent',
      width: 300,
      render: (text: string) => highlightAndRender(text, searchKeyword),
    },
    {
      title: '操作信息',
      dataIndex: 'operationInfo',
      key: 'operationInfo',
      width: 200,
      render: (text: string) => highlightAndRender(text, searchKeyword),
    },
    {
      title: '数据来源',
      dataIndex: 'dataSource',
      key: 'dataSource',
      width: 120,
      render: (text: string) => highlightAndRender(text, searchKeyword),
    },
    {
      title: '设备信息',
      dataIndex: 'deviceInfo',
      key: 'deviceInfo',
      width: 120,
      render: (text: string) => highlightAndRender(text, searchKeyword),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 120,
      render: (text: string) => highlightAndRender(text, searchKeyword),
    },
  ];

  const highlightAndRender = (text: string, keyword: string) => {
    if (!text) return '-';
    if (!keyword) return text;
    
    const highlighted = highlightText(text, keyword);
    return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };

  const mockData = [
    {
      key: '1',
      system: 'TMS',
      mainInfo: '类别:运单操作\n标识号码:6041526698134\n操作类型:修改',
      logContent: 'Electronic Balance inbound, PickupWeig...',
      operationInfo: '操作用户:sorter\n时间:2026-04-16 18:11:02\n菜单:',
      dataSource: '客户端:网页端\n数据来源:单个修改',
      deviceInfo: 'IP:-\n设备唯一码:-',
      remark: '--',
    },
    {
      key: '2',
      system: 'TMS',
      mainInfo: '类别:运单操作\n标识号码:6041626284578\n操作类型:修改',
      logContent: 'Consignee Longitude: 0.000000-->48.5...',
      operationInfo: '操作用户:cornerstone\n时间:2026-04-16 18:11:02\n菜单:',
      dataSource: '客户端:网页端\n数据来源:单个修改',
      deviceInfo: 'IP:-\n设备唯一码:-',
      remark: '--',
    },
  ];

  const displayLogs = logs.length > 0 ? logs : mockData;
  const displayTotal = total > 0 ? total : mockData.length;

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ 
        background: '#fff', 
        padding: '0 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <Title level={4} style={{ margin: 0 }}>日志中心</Title>
        <Space>
          <span style={{ color: '#666' }}>系统: {config?.sysName}</span>
          <Button 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
          >
            退出
          </Button>
        </Space>
      </Header>
      <Content style={{ padding: '24px' }}>
        <Card style={{ marginBottom: 16 }}>
          <Form form={form} layout="inline" style={{ flexWrap: 'wrap' }}>
            <Form.Item name="search" label="日志内容">
              <Input 
                placeholder="请输入搜索内容" 
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
              />
            </Form.Item>
            <Form.Item name="dateRange" label="操作日期">
              <RangePicker 
                showTime 
                style={{ width: 350 }}
                format="YYYY-MM-DD HH:mm:ss"
              />
            </Form.Item>
            <Form.Item name="logCategory" label="日志类别">
              <Select placeholder="全部" style={{ width: 150 }} allowClear>
                <Option value="">全部</Option>
              </Select>
            </Form.Item>
            <Form.Item name="operationType" label="操作类型">
              <Select placeholder="全部" style={{ width: 150 }} allowClear>
                <Option value="">全部</Option>
              </Select>
            </Form.Item>
            <Form.Item name="operationUser" label="操作用户">
              <Select placeholder="全部" style={{ width: 150 }} allowClear>
                <Option value="">全部</Option>
              </Select>
            </Form.Item>
            <Form.Item name="menu" label="菜单">
              <Select placeholder="全部" style={{ width: 150 }} allowClear>
                <Option value="">全部</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  重置
                </Button>
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} loading={loading}>
                  查询
                </Button>
                <Button icon={<ExportOutlined />} onClick={handleExport}>
                  导出
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        <Card>
          <Table
            columns={columns}
            dataSource={displayLogs}
            pagination={false}
            loading={loading}
            scroll={{ x: 1200 }}
            rowKey="key"
          />
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={displayTotal}
              onChange={handlePageChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `共 ${total} 条`}
            />
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default LogCenterPage;
