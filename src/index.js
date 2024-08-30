import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ClientApp from './client/App';
import AdminApp from './admin/App'
import './index.css';
import ComponentWithRouter from './admin/components/withRouter'
import Login from './admin/pages/login';
import OrderCreate from './admin/pages/order/orderCreate';
import OrderList from './admin/pages/order/orderList';
import OrderUpdate from './admin/pages/order/orderUpdate';
import AccountCreate from './admin/pages/account/accountCreate';
import AccountList from './admin/pages/account/accountList';
import Home from './admin/pages/home'

import StoreManage from './admin/pages/store/storeManage';
import Management from './admin/pages/process/Management';
import ProcessList from './admin/pages/process/ProcessList';
import ProcessItem from './admin/pages/process/ProcessItem';
import ProcessOrderUpdate from './admin/pages/process/ProcessOrderUpdate';


import ETracking from './client/pages/eTracking';
import DetailTracking from './client/pages/detailTracking';
import withRouter from './client/components/withRouter'; // 引入 HOC
const OrderCreateWithRouter = ComponentWithRouter(OrderCreate);
const OrderListWithRouter = ComponentWithRouter(OrderList);
const OrderUpdateWithRouter = ComponentWithRouter(OrderUpdate);
const ProcessOrderUpdateWithRouter = ComponentWithRouter(ProcessOrderUpdate);



const ETrackingWithRouter = withRouter(ETracking);
const DetailTrackingWithRouter = withRouter(DetailTracking);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route key="HomePage" path="/admin" element={<Home />} />
        <Route key="orderCreate" path="/admin/Order/OrderCreate" element={<OrderCreateWithRouter />} />
        <Route key="orderList" path="/admin/Order/OrderList" element={<OrderListWithRouter />} />
        <Route key="orderUpdate" path="/admin/Order/OrderUpdate/:orderNum" element={<OrderUpdateWithRouter />} />
        <Route key="accountCreate" path="/admin/Account/Create" element={<AccountCreate />} />
        <Route key="accountList" path="/admin/Account/List" element={<AccountList />} />

        <Route key="accountList" path="/admin/Process/Manage" element={<Management />} />
        <Route key="accountList" path="/admin/Process/List" element={<ProcessList />} />
        <Route key="storeManage" path="/admin/Process/OrderUpdate/:orderNum" element={<ProcessOrderUpdateWithRouter />} />
        <Route key="storeManage" path="/admin/Process/Start/:orderNum" element={<ProcessItem />} />

        <Route key="storeManage" path="/admin/Store/Manege" element={<StoreManage />} />
        <Route key="eTracking" path="/client/eTracking" element={<ETrackingWithRouter />} />
        <Route key="detailTracking" path="/client/detailTracking" element={<DetailTrackingWithRouter />} />

        {/* <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/client/*" element={<ClientApp />} />
        <Route key="notFound" path="*" element={<Navigate replace to="/client/eTracking" />} /> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)