import React, { Component } from 'react';
import { Tabs, Descriptions, Steps, Layout, Card, Image, Select,Modal } from 'antd';

const { Content } = Layout;
const { Step } = Steps;

export default class DetailTracking extends Component {
  state = {
    size: "large",
    previewVisible: false,
    previewImage: '',
    selectedProduct:'',
    orderData:null,
    paymentData:null,
  }
  columnTab = ['訂單資訊', '付款資訊', '貨態追蹤']

  componentDidMount() {
    const { state } = this.props.location
    if (state && state.orderData && state.paymentData) {
      const { orderData, paymentData } = state
      this.setState({orderData,paymentData })
    }
  }
  
  order = {
    'orderNum': 'AB1234567',
    'customer': 'Allen',
    'address': '新北市新莊區民安路428號',
    'deliveryDate':'2024/08/05',
    'orderImg':'/img/order/S__45826127.jpg',
    'productList':[
      { 
        'prodId':'1',
        'prodName':'Sonia 桑尼亞沙發',
        'tracking':[
          {
            'method': '進入製程',
            'completedDate': '2024/06/30 08:35',
            'img': []
          },
          {
            'method': '骨架完成',
            'completedDate': '2024/07/01 08:35',
            'img': [
              '/img/workorder/4.jpg',
              '/img/workorder/5.jpg',
            ]
          },
          {
            'method': '泡棉鋪設',
            'completedDate': '2024/07/02 21:15',
            'img': [
              '/img/workorder/1.png',
              '/img/workorder/2.jpg',
              '/img/workorder/3.jpg',
              '/img/workorder/1.png',
              '/img/workorder/2.jpg',
            ]
          },
        ]
      },
      {
        'prodId':'2',
        'prodName':'Alita 艾莉塔沙發',
        'tracking':[
          {
            'method': '進入製程',
            'completedDate': '2024/06/30 08:35',
            'img': []
          },
          {
            'method': '滑軌安裝',
            'completedDate': '2024/07/02 21:15',
            'img': [
              '/img/workorder/1.png',
              '/img/workorder/2.jpg',
              '/img/workorder/3.jpg'
            ]
          },
          {
            'method': '獨立筒鋪設',
            'completedDate': '2024/07/01 08:35',
            'img': [
              '/img/workorder/4.jpg',
              '/img/workorder/5.jpg',
            ]
          },
        ]
      }
    ]
  }
  payment = {
    'paymentTotal': '10,000',
    'paymentPaidStr':'<p>已付訂金2,000，6/3，信用卡</p><p>已付訂金3,000，6/10，匯款</p>',
    'paymentPaid': '5,000',
    'invoiceType': '三聯',
    'invoiceID':'54847882',
    'invoiceTitle':'坐又銘有限公司',
    'invoiceAddr':'台北市中正區重慶南路一段',
  }
  handleCancel = () => {
    this.setState({
      previewVisible: false,
      previewImage: ''
    })
  }
  renderOrderInfo = () => {
    const {orderData}=this.state
    if (!orderData) {
      return <div>Loading...</div>; // 或者你可以返回一个空状态或提示
    }
    console.log('renderOrderInfo_orderData',orderData)
    return (
      <Card title="訂單資訊" bordered={false} style={{ marginBottom: 24 ,textAlign: 'left'}}>
        <Descriptions bordered size="middle" column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}>
          <Descriptions.Item label="訂單號碼">{orderData.orderNum}</Descriptions.Item>
          <Descriptions.Item label="客戶">{orderData.customer}</Descriptions.Item>
          <Descriptions.Item label="產品">{orderData.prodName}</Descriptions.Item>
          <Descriptions.Item label="出貨日期">{orderData.deliveryDate}</Descriptions.Item>
          <Descriptions.Item label="送貨地址">{orderData.address}</Descriptions.Item>
          <Descriptions.Item label="紙本訂單">
            <Image
              key={1}
              width={100}
              src={orderData.orderImg}
            />
          </Descriptions.Item>
        </Descriptions>
      </Card>
    )
  }
  renderPaymentInfo = () => {
    const {invoiceType}=this.payment
    return (
      <Card title="付款資訊" bordered={false} style={{ marginBottom: 24 ,textAlign: 'left'}}>
        <Descriptions bordered size="middle" column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}>
          <Descriptions.Item label="發票類型">{this.payment.invoiceType}</Descriptions.Item>
          {invoiceType==='三聯'&&
            (
              <React.Fragment>
                <Descriptions.Item label="發票統編">{this.payment.invoiceID}</Descriptions.Item>
                <Descriptions.Item label="發票抬頭">{this.payment.invoiceTitle}</Descriptions.Item>
              </React.Fragment>
            )
          }
          <Descriptions.Item label="發票地址">{this.payment.invoiceAddr}</Descriptions.Item>
          <Descriptions.Item label="總計">${this.payment.paymentTotal}</Descriptions.Item>
          <Descriptions.Item label="已付款">${this.payment.paymentLast}</Descriptions.Item>
          <Descriptions.Item label="訂金">{<div dangerouslySetInnerHTML={{ __html: this.payment.paymentPaidStr }} />}</Descriptions.Item>
          {/* <Descriptions.Item label="訂金紀錄">{this.payment.paymentPaid.map((paidObj,index)=>{
            return  <li key={index}>{index+1}. {paidObj}</li>
          })}</Descriptions.Item> */}
        </Descriptions>
      </Card>
    )
  }
  handleChange=(choseVal)=>{
    const {orderData} = this.state
    const prodTracking=orderData.productList.find((obj)=>{
      return obj.prodId===choseVal
    })
    this.setState({selectedProduct:prodTracking})
  }
  renderTrackingInfo = () => {
    const { selectedProduct,orderData } = this.state
    const productOptions = orderData.productList.map((prodObj) => ({
      value: prodObj.prodId,
      label: prodObj.prodName,
    }))
    return (
      <div>
        <Select
          showSearch
          style={{
            width: 300,
            marginBottom: 24
          }}
          placeholder="請選擇產品追蹤"
          optionFilterProp="label"
          options={productOptions}
          onChange={this.handleChange}
        />
        {selectedProduct && (
          <Card title="貨態追蹤" bordered={false} style={{ marginBottom: 24 }}>
            <Steps direction="vertical" current={-1}>
              {selectedProduct.tracking.map((obj, index) => (
                <Step
                  key={index}
                  title={<div style={{ fontSize: '16px' }}>{obj.method}</div>}
                  description={
                    <div style={{ fontSize: '14px' }}>
                      <div>{obj.completedDate}</div>
                      <div>
                        {obj.img.map((imgSrc, imgIndex) => (
                          <Image
                            key={imgIndex}
                            width={100}
                            src={imgSrc}
                          />
                        ))}
                      </div>
                    </div>
                  }
                />
              ))}
            </Steps>
            <Modal className="preview-modal" open={this.state.previewVisible} footer={null} onCancel={this.handleCancel} >
              <img alt="preview" style={{ width: '100%' }} src={this.state.previewImage} />
            </Modal>
          </Card>
        )}
      </div>
    )
  }
  render() {
    return (
      <Layout>
        <Content>
          <div>
            <Tabs
              defaultActiveKey="0"
              type="card"
              size={this.state.size}
              items={
                this.columnTab.map((obj, index) => {
                  return {
                    label: obj,
                    key: index,
                    children: index === 0 ? this.renderOrderInfo() :
                      index === 1 ? this.renderPaymentInfo() :
                        this.renderTrackingInfo(),
                  }
                })
              }
            />
          </div>
        </Content>
      </Layout>
    )
  }
}
