import React, { Component } from 'react';
import { Form, Input, Button, Checkbox, Layout, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import ComponentHeader from '../components/Header';

const { Content, Footer } = Layout;
const { Title } = Typography;

export default class Login extends Component {
  contentStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
  layoutStyle = {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column', // 添加此行以垂直對齊元素
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  }
  formStyle = {
    maxWidth: '300px',
    width: '100%',
    padding: '40px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
  }
  footerStyle = {
    textAlign: 'center',
    backgroundColor: '#c9cdd1',
    width: '100%', //整個頁面的100%的寬度
  }
  handleOnFinish = (values) => {
    this.props.onLogin(values);
  }

  render() {
    return (
      <Layout style={this.layoutStyle}>
        <ComponentHeader />
        <Content style={this.contentStyle}>
          <div style={this.formStyle}>
            <Title level={2} style={{ textAlign: 'center' }}>
              <img src="/adminLogo.png" alt="訂單追蹤系統" className="header-logo" />
            </Title>
            <Form
              name="normal_login"
              initialValues={{ remember: true }}
              onFinish={this.handleOnFinish}>
              <Form.Item
                name="username"
                rules={[{ required: true, message: '請輸入帳號!' }]}>
                <Input
                  prefix={<UserOutlined />}
                  placeholder="帳號" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: '請輸入密碼!' }]}>
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="密碼" />
              </Form.Item>
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>記住我</Checkbox>
                </Form.Item>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>登入</Button>
              </Form.Item>
            </Form>
          </div>
        </Content>
        <Footer style={this.footerStyle}>坐又銘有限公司 <br /> Copyright © zuoyominsofa.</Footer>
      </Layout>
    )
  }
}
