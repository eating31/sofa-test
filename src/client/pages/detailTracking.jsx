import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { Tabs, Descriptions, Steps, Layout, Card, Image, Select,Modal,message,Button  } from 'antd';
import dayjs from 'dayjs';
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
    redirect:false
  }
  columnTab = ['訂單資訊', '付款資訊', '貨態追蹤']

  componentDidMount() {
    const { state } = this.props.location
    if (state && state.orderData && state.paymentData) {
      const { orderData, paymentData } = state
      this.setState({orderData,paymentData })
    }
    else{
      message.error('訂單資料缺失，返回查詢頁面')
      this.setState({ redirect: true })
    }
  }
  handleRetry = () => {
    this.setState({ redirect: true })
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
      return <div>Loading...</div>
    } 
    const formattedDate = (orderData.shipmentDate)?dayjs(orderData.shipmentDate).format('YYYY/MM/DD HH:mm'):''
    console.log('orderData',orderData)
    console.log('orderData.orderImg',orderData.orderImg)
    return (
      <Card title="訂單資訊" bordered={false} style={{ marginBottom: 24 ,textAlign: 'left'}}>
        <Descriptions bordered size="middle" column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}>
          <Descriptions.Item label="訂單號碼">{orderData.orderNum}</Descriptions.Item>
          <Descriptions.Item label="客戶">{orderData.customer}</Descriptions.Item>
          <Descriptions.Item label="產品">{
            orderData.productList.map((obj)=>{
              return <p key={obj.prodId}>{obj.prodName}</p>
            })
          }
          </Descriptions.Item>
          <Descriptions.Item label="出貨日期">{formattedDate?formattedDate:''}</Descriptions.Item>
          <Descriptions.Item label="送貨地址">{orderData.address}</Descriptions.Item>
          <Descriptions.Item label="紙本訂單">
            <Image
              key={1}
              width={100}
              src={process.env.REACT_APP_API_PATH+orderData.orderImg}
            />
          </Descriptions.Item>
        </Descriptions>
      </Card>
    )
  }
  renderPaymentInfo = () => {
    const { paymentData } = this.state
    if (!paymentData) {
      return <div>Loading...</div>
    }
    const {invoiceType}=paymentData
    return (
      <Card title="付款資訊" bordered={false} style={{ marginBottom: 24 ,textAlign: 'left'}}>
        <Descriptions bordered size="middle" column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}>
          <Descriptions.Item label="發票類型">{paymentData.invoiceType}</Descriptions.Item>
          {invoiceType==='三聯'&&
            (
              <React.Fragment>
                <Descriptions.Item label="發票統編">{paymentData.invoiceID}</Descriptions.Item>
                <Descriptions.Item label="發票抬頭">{paymentData.invoiceTitle}</Descriptions.Item>
              </React.Fragment>
            )
          }
          <Descriptions.Item label="發票地址">{paymentData.invoiceAddr}</Descriptions.Item>
          <Descriptions.Item label="總計">NT${paymentData.paymentTotal.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="已付款">NT${paymentData.paymentPaid.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="訂金">{<div dangerouslySetInnerHTML={{ __html: paymentData.paymentPaidStr }} />}</Descriptions.Item>
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
    if (!orderData) {
      return <div>Loading...</div>
    }
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
              {
              selectedProduct.tracking.map((obj, index) => (
                <Step
                  key={index}
                  title={<div style={{ fontSize: '16px' }}>{obj.method}</div>}
                  description={
                    <div style={{ fontSize: '14px' }}>
                      <div>{dayjs(obj.completedDate).format('YYYY/MM/DD HH:mm')}</div>
                      <div>
                        {
                          obj.img.map((imgSrc, imgIndex) => {
                            const fileType = imgSrc.split('.').pop().toLowerCase()
                            const isVideo = ['mp4', 'mov', 'ogg'].includes(fileType)
                            return isVideo ? (
                              <video
                                key={imgIndex}
                                width="100%"
                                height="auto"
                                controls
                                style={{ maxWidth: '100%', height: 'auto' }}
                                src={process.env.REACT_APP_API_PATH + imgSrc}
                              >
                              </video>
                            ):
                            (
                              <Image
                                key={imgIndex}
                                width={100}
                                height={100} 
                                style={{ objectFit: 'cover' }}  
                                src={process.env.REACT_APP_API_PATH+imgSrc}
                              />
                            )
                          })
                        }
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
    if(this.state.redirect ===true){
      return <Navigate to="/client/eTracking" replace />;
    }
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
            <Button type="primary" onClick={this.handleRetry} style={{marginTop: 24, backgroundColor: '#4EBEC6', borderColor: '#4EBEC6' }}>
              重新查詢
            </Button>
          </div>
        </Content>
      </Layout>
    )
  }
}
