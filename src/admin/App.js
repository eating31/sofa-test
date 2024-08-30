import React, { Component } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import ComponentHeader from './components/Header'
import ComponentSideMenu from './components/SideMenu';
import ComponentWithRouter from './components/withRouter'
import Login from './pages/login';
import OrderCreate from './pages/order/orderCreate';
import OrderList from './pages/order/orderList';
import OrderUpdate from './pages/order/orderUpdate';
import AccountCreate from './pages/account/accountCreate';
import AccountList from './pages/account/accountList';
import Home from './pages/home'
import axios from 'axios';
import StoreManage from './pages/store/storeManage';
import Management from './pages/process/Management';
import ProcessList from './pages/process/ProcessList';
import ProcessItem from './pages/process/ProcessItem';
import ProcessOrderUpdate from './pages/process/ProcessOrderUpdate';
import { authError } from './utils/jwt';

const { Footer, Content } = Layout;
const OrderCreateWithRouter = ComponentWithRouter(OrderCreate);
const OrderListWithRouter = ComponentWithRouter(OrderList);
const OrderUpdateWithRouter = ComponentWithRouter(OrderUpdate);
const ProcessOrderUpdateWithRouter = ComponentWithRouter(ProcessOrderUpdate);
export default class App extends Component {

  state = {
    collapsed: true,
    isLogin: localStorage.getItem('token'),
  }
  layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    flex: '1',
  }
  contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '100%',
    backgroundColor: '#c9cdd1',
  }
  footerStyle = {
    textAlign: 'center',
    backgroundColor: '#c9cdd1',
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }
  handleLogin = async (values) => {
    const { username, password } = values;
    axios.post(`${process.env.REACT_APP_API_PATH}/api/user/login`, { account: username, password })
      .then(res => {
        console.log(res.data)
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('name', res.data.user)
        alert(res.data.message)
        // 重新整理 讓系統判斷token
        window.location.reload()
      }).catch(err => {
        console.log(err)
        if (err.response?.status === 401) {
          alert(err.response.data)
        } else {
          alert(err.message, '請再試一次')
        }
      })
  }

  render() {
    if (!this.state.isLogin) {
      return <Login onLogin={this.handleLogin} />
    }
    return (
      <Layout style={this.layoutStyle}>
        <ComponentSideMenu collapsed={this.state.collapsed} toggleCollapsed={this.toggleCollapsed} />
        <Layout style={{ marginLeft: this.state.collapsed ? 80 : 200 }}>
          <ComponentHeader />
          <Content style={this.contentStyle}>
            <Routes>
              <Route key="HomePage" path="/" element={<Home />} />
              <Route key="orderCreate" path="Order/OrderCreate" element={<OrderCreateWithRouter />} />
              <Route key="orderList" path="Order/OrderList" element={<OrderListWithRouter />} />
              <Route key="orderUpdate" path="Order/OrderUpdate/:orderNum" element={<OrderUpdateWithRouter />} />
              <Route key="accountCreate" path="Account/Create" element={<AccountCreate />} />
              <Route key="accountList" path="Account/List" element={<AccountList />} />

              <Route key="accountList" path="Process/Manage" element={<Management />} />
              <Route key="accountList" path="Process/List" element={<ProcessList />} />
              <Route key="storeManage" path="Process/OrderUpdate/:orderNum" element={<ProcessOrderUpdateWithRouter />} />
              <Route key="storeManage" path="Process/Start/:orderNum" element={<ProcessItem />} />

              <Route key="storeManage" path="Store/Manege" element={<StoreManage />} />
            </Routes>
          </Content>
          <Footer style={this.footerStyle}>坐又銘有限公司 <br /> Copyright © zuoyominsofa.</Footer>
        </Layout>
      </Layout>
    )
  }
}
