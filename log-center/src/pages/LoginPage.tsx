import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { saveConfig, getConfig } from '../utils';

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const config = getConfig();
    if (config) {
      form.setFieldsValue(config);
    }
  }, [form]);

  const handleSubmit = async (values: { authorization: string; sysName: string }) => {
    setLoading(true);
    try {
      saveConfig(values);
      message.success('配置保存成功，正在跳转...');
      setTimeout(() => {
        navigate('/logs');
      }, 500);
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card 
        title={<div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>日志中心系统</div>}
        style={{ width: 450, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ sysName: 'TMS' }}
        >
          <Form.Item
            name="authorization"
            label="Authorization Token"
            rules={[{ required: true, message: '请输入 Authorization Token' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入 Authorization Token"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="sysName"
            label="系统名称 (sysName)"
            rules={[{ required: true, message: '请输入系统名称' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入系统名称，如 TMS"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} size="large" block>
              确定
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
