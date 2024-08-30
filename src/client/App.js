import React, { Component } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './components/header';
import ETracking from './pages/eTracking';
import DetailTracking from './pages/detailTracking';
import withRouter from './components/withRouter'; // 引入 HOC
import './App.css'; // 引入CSS文件

const { Footer, Content } = Layout;
const ETrackingWithRouter = withRouter(ETracking);
const DetailTrackingWithRouter = withRouter(DetailTracking);

export default class App extends Component {
  footerStyle = {
    textAlign: 'center',
    backgroundColor: '#c9cdd1',
  }
  layoutStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  }
  contentStyle = {
    flex: 1,
  }

  render() {
    return (
      <Layout style={this.layoutStyle}>
        <Content style={this.contentStyle}>
          <div className="app-container">
            <Header />
            <Routes>
              <Route key="eTracking" path="eTracking" element={<ETrackingWithRouter  />} />
              <Route key="detailTracking" path="detailTracking" element={<DetailTrackingWithRouter />} />
              <Route key="notFound" path="*" element={<Navigate replace to="eTracking" />} />
            </Routes>
          </div>
        </Content>
        <Footer style={this.footerStyle}>坐又銘有限公司 | 統編54847882 Copyright © zuoyominsofa.</Footer>
      </Layout>
    )
  }
}
