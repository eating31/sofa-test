import React, { Component } from 'react';
import PaymentList from '../../components/OrderManage/paymentList';
import ShipmentList from '../../components/OrderManage/shipmentList';
import { authError } from '../../utils/jwt';
import { Table, Breadcrumb, Space, Button, Input ,message,Spin,Badge} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import '../../css/orderForm.css'; // 引入CSS
import axios from 'axios';
import dayjs from 'dayjs';

export default class OrderList extends Component {
  state = {
    searchText: '',
    searchedColumn: '',
    orderList:[],
    loading: true,
    openPayDialog:false,
    choseOrder:null,
    openShipDialog:false,
  }
  searchInput = React.createRef(null) //搜索欄位
  token = localStorage.getItem('token')
  componentDidMount(){
    this.getPageData()
  }
  getPageData=async ()=>{
    try{
      const response =await axios.get(`${process.env.REACT_APP_API_PATH}/api/admin/order`, {
        headers: {
            Authorization: this.token
        },
      })
      if (response.data  && response.status===200){
          this.setState({orderList:response.data,loading: false})
      }
      else{
          message.error('訂單列表失敗')
      }
    }
    catch(error){
        if (error.response && error.response.status === 400 &&error.response.status === 404) {
            console.error('error.response.data.error:', error.response.data.error);
            message.error(error.response.data.error);
        } else if(error.response?.status === 401) {
          authError(error.response)
        }
        else {
            console.error('Error:', error)
            message.error('其他錯誤',error)
        }
    }
  }
  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={this.searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            搜尋
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            重置
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.current.select(), 100);
      }
    },
  })
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  }
  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  }
  handleUpdate=(orderNum)=>{
    this.props.navigate(`/admin/Order/OrderUpdate/${orderNum}`)
  }
  handleDelete=async (orderNum)=>{
    try{
      const response =await axios.delete(`${process.env.REACT_APP_API_PATH}/api/admin/order/${orderNum}`, {
        headers: {
            Authorization: this.token
        },
      })
      if (response.data  && response.status===200){
          message.success('訂單刪除成功')
          this.getPageData()
      }
      else{
          message.error('訂單刪除失敗')
      }
    }
    catch(error){
        if (error.response && error.response.status === 400) {
            console.error('error.response.data.error:', error.response.data.error);
            message.error(error.response.data.error);
        } else {
            console.error('Error:', error)
            message.error('其他錯誤',error)
        }
    }
  }
  handlePayDialog=(orderNum)=>{
    this.setState({ openPayDialog: true ,choseOrder:orderNum})
  }
  handleCancelDialog=()=>{
      this.setState({ openPayDialog: false,choseOrder:null})
  }
  handleSubmitDialog=async (values)=>{
    const {returnPayOrder}=values //網址上的orderNum
    const {choseOrder}=this.state //state上的orderNum
    if(returnPayOrder!==choseOrder){
      message.error('訂單號與付款訂單號不同')
    }
    try{
      const response= await axios.post(`${process.env.REACT_APP_API_PATH}/api/admin/payment/${this.state.choseOrder}`,values, {
        headers: {
            Authorization: this.token
        },
      })
      if (response.data  && response.status===200){
          message.success('新增付款紀錄成功')
          this.setState({ openPayDialog: false, choseOrder: null }); 
          this.getPageData()
      }
      else{
          message.error('付款新增失敗')
      }
    }
    catch(error){
        if (error.response && error.response.status === 400) {
            console.error('error.response.data.error:', error.response.data.error);
            message.error(error.response.data.error);
        } else {
            console.error('Error:', error)
            message.error('付款其他錯誤',error)
        }
    }
  }
  handleDialogUpdate=()=>{
    this.getPageData()
  }
  handleShipment=(orderNum)=>{
    this.setState({openShipDialog:true,choseOrder:orderNum})
  }
  handleCancelShipDialog=()=>{
    this.setState({openShipDialog:false,choseOrder:null})
  }
  handleSubmitShipment=async (values)=>{
    const {returnShipOrder}=values //網址上的orderNum
    const {choseOrder}=this.state //state上的orderNum
    if(returnShipOrder!==choseOrder){
      message.error('訂單號與出貨訂單號不同')
    }
    try{
      const response= await axios.post(`${process.env.REACT_APP_API_PATH}/api/admin/shipment/`,values, {
        headers: {
            Authorization: this.token
        },
      })
      if (response.data  && response.status===200){
          message.success('新增出貨單成功')
          this.setState({ openShipDialog: false, choseOrder: null }); 
          this.getPageData()
      }
      else{
          message.error('新增出貨單失敗')
      }
    }
    catch(error){
        if (error.response && error.response.status === 400) {
            console.error('error.response.data.error:', error.response.data.error);
            message.error(error.response.data.error);
        } else {
            console.error('Error:', error)
            message.error('出貨單其他錯誤',error)
        }
    }
  }
  handleConfrim = async (values) => {
    const { orderNum } = values;  
    try {
        const response = await axios.put(`${process.env.REACT_APP_API_PATH}/api/admin/order/confirmOrder`, { orderNum }, {
          headers: {
              Authorization: this.token
          },
        });
        if (response.data  && response.status===200){
          message.success('確認訂單成功')
          this.getPageData()
      }
      else{
          message.error('確認訂單失敗')
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
          console.error('error.response.data.error:', error.response.data.error);
          message.error(error.response.data.error);
      } else {
          console.error('Error:', error)
          message.error('確認訂單其他錯誤',error)
      }
    }
  }

  columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 65,
    },
    {
      title: '訂單號碼',
      dataIndex: 'orderNum',
      key: 'orderNum',
      width: 150,
      ...this.getColumnSearchProps('orderNum'),
    },
    {
      title: '訂單狀態',
      dataIndex: 'state',
      key: 'state',
      render: (state) => {
        return state===0? <Badge status="default"  text='未確認'/>:
          state===1?<Badge status="success"  text='訂單已確認'/>:
            state===2?<Badge status="processing"  text='製程進行'/>:
              state===3?<Badge status="processing"  text='品檢完成'/>:
                state===4?<Badge status="processing"  text='出貨安排'/>:
                  state===5?<Badge status="success"  text='訂單結案'/>:  
                    <Badge status='error' text='取消'/>
      },
    },
    {
      title: '貴賓姓名',
      dataIndex: 'customer',
      key: 'customer',
      ...this.getColumnSearchProps('customer'),
    },
    {
      title: '連絡電話',
      dataIndex: 'phoneOne',
      key: 'phoneOne',
      ...this.getColumnSearchProps('phoneOne'),
    },
    {
      title: '送貨地址',
      dataIndex: 'address',
      key: 'address',
      ...this.getColumnSearchProps('address'),
    },
    {
      title: '發票類型',
      dataIndex: 'invoiceType',
      key: 'invoiceType',
      render: (invoiceType) => {
        return invoiceType === 1 ? '二聯' : 
          invoiceType === 2 ?'三聯':'';
      },
    },
    {
      title: '產品名稱',
      dataIndex: 'products',
      key: 'products',
      render: (products) => 
        (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} x {product.count}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: '訂單總價',
      dataIndex: 'paymentTotal',
      key: 'paymentTotal',
      render: (paymentTotal) => {
        return `$${paymentTotal.toLocaleString()}`;
      },
    },
    {
      title: '已付款',
      dataIndex: 'paymentPaid',
      key: 'paymentPaid',
      render: (paymentPaid) => {
        return `$${paymentPaid.toLocaleString()}`;
      },
    },
    {
      title: '確認出貨日期',
      dataIndex: 'Shipments',
      key: 'shipmentDate',
      render: (Shipments) => 
        Shipments.length > 0 ? (
          Shipments.map((obj,index)=>{
            return (
              <div key={index}>
                {dayjs(obj.shipmentDate).format('YYYY-MM-DD HH:mm')}
              </div>
            )
          })
        ) : (
          <span>未安排出貨</span>
        ),
    },
    {
      title: '建單者',
      dataIndex: 'createUserName',
      key: 'createUserName',
    },
    {
      title: '更新者',
      dataIndex: 'updateUserName',
      key: 'updateUserName',
    },
    {
      title: '建立時間',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => {
        return dayjs(createdAt).format('YYYY-MM-DD HH:mm')
      },
      sorter: {
        compare: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      },
    },
    {
      title: '更新時間',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (updatedAt) => {
        return dayjs(updatedAt).format('YYYY-MM-DD  HH:mm')
      },
    },
    {
      title: '管理',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => {
        return (
          <Space size="middle">
            <Button type="primary" ghost onClick={() => this.handleUpdate(record.orderNum)}>{record.finish === 0?"編輯":"查看"}</Button>
            <Button danger onClick={() => this.handlePayDialog(record.orderNum)}  style={{ borderColor: 'green', color: 'green' }} >付款紀錄</Button>
            {(record.state === 0)?
              <Button danger onClick={() => this.handleConfrim({orderNum:record.orderNum})} style={{ borderColor: 'orange', color: 'orange' }} >確認訂單</Button>:null
            }
            <Button danger onClick={() => this.handleShipment(record.orderNum)} style={{ borderColor: 'purple', color: 'purple' }} >出貨紀錄</Button>
            {(record.finish !== 1)?
              <Button danger onClick={() => this.handleDelete(record.orderNum)}>刪除</Button>:null
            }
          </Space>
        )
      }
    },
  ]

  render() {
    return (
      <div className="order-form-container" style={{ minHeight: '84vh' }}>
        <Breadcrumb
          items={[
            { title: 'Home', href: '/admin' },
            { title: '訂單管理' },
            { title: '訂單列表' },
          ]}
        />
        <br />
        {
          this.state.loading ? (<Spin tip="Loading" size="large"><Table dataSource={[]} columns={this.columns} pagination={false} /></Spin>) : 
          ( <Table dataSource={this.state.orderList} rowKey="orderNum" columns={this.columns} scroll={{ x: 'max-content' }}  pagination={{ pageSize: 15 }} />)
        }
        <PaymentList 
          open={this.state.openPayDialog} 
          onCancel={this.handleCancelDialog} 
          onCreate={this.handleSubmitDialog} 
          choseOrder={this.state.choseOrder}
          onPaymentUpdate={this.handleDialogUpdate} />

        <ShipmentList
          open={this.state.openShipDialog} 
          onCancel={this.handleCancelShipDialog} 
          onCreate={this.handleSubmitShipment} 
          choseOrder={this.state.choseOrder}
          onShipmentUpdate={this.handleDialogUpdate} />
          
      </div>
    )
  }
}
