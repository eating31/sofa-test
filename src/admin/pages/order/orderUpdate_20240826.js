import React, { Component } from 'react';
import { Form, Input, Button, DatePicker, InputNumber, Radio, Row, Col, Breadcrumb,message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios';
import '../../css/orderForm.css'; // 引入CSS

export default class OrderUpdate extends Component {

  formRef = React.createRef()

  state = {
    order: null,
  }
  token = localStorage.getItem('token')
  async componentDidMount() {
    this.getPageData()
  }

  getPageData=async()=>{
    const { orderNum } = this.props.params
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_PATH}/api/admin/order/${orderNum}`, {
        headers: {
            Authorization: this.token
        },
      })
      if (response.data  && response.status===200)
        {
          this.setState({ order: response.data }, () => {
            this.setInitialValues()
          })
        }
      else{
        message.error('訂單資料失敗')
      }  
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error('error.response.data.error:', error.response.data.error);
        message.error(error.response.data.error);
      } else {
        console.error('Error:', error)
        message.error('訂單資料其他錯誤',error)
      }
    }
  }
  
  setInitialValues = () => {
    if (this.formRef.current) {
      const { order } = this.state;
      const initialValues = {
        ...order,
        invoiceType: order.invoiceType != null ? order.invoiceType.toString() : null,
        invoiceAddrType: order.invoiceAddrType != null ? order.invoiceAddrType.toString() : null,
        customerBirth: order.customerBirth ? dayjs(order.customerBirth) : null,
        estimatedDate: order.estimatedDate ? dayjs(order.estimatedDate) : null,//datepicker已經有設定格式format={'YYYY-MM-DD'}
        products: order.products.map(product => ({
          productId:product.id,
          productName: product.name,
          productSpec: product.description,
          productAmount: product.count,
          productPrice: product.price,
        })),
      }
      this.formRef.current.setFieldsValue(initialValues)
    }
  }

  onFinish = async (values) => {
    const { orderNum } = this.props.params
    const formattedValues = {
      ...values,
      customerBirth: values.customerBirth ? values.customerBirth.format('YYYY-MM-DD') : null,
      estimatedDate: values.estimatedDate ? values.estimatedDate.format('YYYY-MM-DD HH:mm') : null,
      products: values.products.map(product => ({
        productId: product.productId, 
        name: product.productName,
        description: product.productSpec,
        price: product.productPrice,
        count: product.productAmount,
      })),
    }
    
    // console.log('this.state.order載進來的',this.state.order)
    // console.log('this.state.order.products載進來的',this.state.order.products)
    // console.log('formattedValues表單的',formattedValues)
    // console.log('formattedValues.products表單的',formattedValues.products)
    try{
        const response =await axios.put(`${process.env.REACT_APP_API_PATH}/api/admin/order/${orderNum}`,formattedValues, {
          headers: {
              Authorization: this.token
          },
        })
        if (response.data  && response.status===200){
            message.success('訂單更新成功')
            this.getPageData()
            
        }
        else{
            message.error('訂單更新失敗')
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

  render() {
    const {order}=this.state
    if(order){
      return (
        <div className="order-form-container">
          <Breadcrumb
            items={[
              { title: 'Home', href: '/admin' },
              { title: '訂單列表', href: '/admin/Order/OrderList' },
              { title: '編輯訂單' },
            ]}
          />
          <br />
          <Form ref={this.formRef} layout="vertical" onFinish={this.onFinish}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="orderNum"
                  label="訂單編號(不可修改)"
                  rules={[{ required: true, message: '訂單編號' }]}
                >
                  <Input placeholder="請輸入訂單編號" readOnly />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="customer"
                  label="貴賓姓名"
                  rules={[{ required: true, message: '請輸入貴賓姓名' }]}
                >
                  <Input placeholder="先生/小姐" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="customerBirth"
                  label="貴賓生日"
                >
                  <DatePicker placeholder="選擇日期(ex:2000-01-01)" style={{ width: '100%' }}  format={'YYYY-MM-DD'} getPopupContainer={trigger => trigger.parentNode} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="phoneOne"
                  label="連絡電話1"
                  rules={[{ required: true, message: '請輸入連絡電話1' }]}
                >
                  <Input placeholder="輸入電話號碼1" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phoneTwo"
                  label="連絡電話2"
                >
                  <Input placeholder="輸入電話號碼2" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="address"
                  label="送貨地址"
                  rules={[{ required: true, message: '請輸入送貨地址' }]}
                >
                  <Input placeholder="輸入送貨地址" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="invoiceType"
                  label="發票"
                  rules={[{ required: true, message: '請選擇發票類型' }]}
                >
                  <Radio.Group>
                    <Radio value='1'>二聯</Radio>
                    <Radio value='2'>三聯</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item shouldUpdate={(prevValues, currentValues) => { return prevValues.invoiceType !== currentValues.invoiceType }}>
                  {({ getFieldValue }) => {
                    const invoiceType = getFieldValue('invoiceType');
                    return invoiceType === '2' && (
                      <Form.Item
                        name="invoiceTitle"
                        label="發票抬頭"
                        rules={[{ required: true, message: '輸入發票抬頭' }]}
                      >
                        <Input placeholder="輸入發票抬頭" />
                      </Form.Item>
                    )
                  }}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item shouldUpdate={(prevValues, currentValues) => { return prevValues.invoiceType !== currentValues.invoiceType }}>
                  {({ getFieldValue }) => {
                    const invoiceType = getFieldValue('invoiceType');
                    return invoiceType === '2' && (
                      <Form.Item
                        name="invoiceID"
                        label="發票統編"
                        rules={[{ required: true, message: '輸入發票統編' }]}
                      >
                        <Input placeholder="輸入發票統編" />
                      </Form.Item>
                    )
                  }}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="invoiceAddrType"
                  label="發票配送方式"
                  rules={[{ required: true, message: '請選擇配送方式' }]}
                >
                  <Radio.Group>
                    <Radio value="1">隨貨</Radio>
                    <Radio value="2">寄送</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item shouldUpdate={(prevValues, currentValues) => { return prevValues.invoiceAddrType !== currentValues.invoiceAddrType }}>
                  {({ getFieldValue }) => {
                    const invoiceAddrType = getFieldValue('invoiceAddrType');
                    return invoiceAddrType === '2' && (
                      <Form.Item
                        name="invoiceAddr"
                        label="發票寄送地址"
                        rules={[{ required: true, message: '輸入發票寄送地址' }]}
                      >
                        <Input placeholder="輸入發票寄送地址" />
                      </Form.Item>
                    )
                  }}
                </Form.Item>
              </Col>
            </Row>
            <Form.List name="products">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row gutter={16} key={key}>
                      <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'productName']}
                          label={(order.state !== 0 && order.state !== 1)?<>產品名稱<span style={{ color: 'red' }}> (製程已開工，不可修改)</span></> :"產品名稱"}
                          rules={[{ required: true, message: '請輸入產品名稱' }]}
                        >
                          <Input placeholder="輸入產品名稱" disabled={order.state !== 0 && order.state !== 1 }/>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'productSpec']}
                          label="規格"
                          rules={[{ required: true, message: '請輸入規格' }]}
                        >
                          <Input placeholder="輸入規格" disabled={order.state !== 0 && order.state !== 1 }/>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              {...restField}
                              name={[name, 'productAmount']}
                              label="數量"
                              rules={[{ required: true, message: '請輸入數量' }]}
                            >
                              <Input placeholder="輸入數量" disabled={order.state !== 0 && order.state !== 1 }/>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              {...restField}
                              name={[name, 'productPrice']}
                              label="金額"
                              rules={[{ required: true, message: '請輸入金額' }]}
                            >
                            <InputNumber
                              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                              style={{width: '100%',}}
                              placeholder="輸入金額"
                              disabled={order.state !== 0 && order.state !== 1 }
                            />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                    {  
                      (order.state === 0 || order.state === 1 ) &&
                        (
                          <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                            <MinusCircleOutlined onClick={() => remove(name)} style={{ marginTop: '40px' }} />
                          </Col>
                        )
                    }
                    </Row>
                  ))}
                  <Form.Item>
                  {  
                    (order.state === 0 || order.state === 1 ) &&
                    (
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        新增產品詳情
                      </Button>
                    )
                  } 
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="paymentTotal"
                  label="總計"
                  rules={[{ required: true, message: '請輸入總計金額' }]}
                >
                  <InputNumber
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                    style={{width: '100%',}}
                    placeholder="輸入總計金額"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="estimatedDate"
                  label="預估出貨日期"
                  rules={[{ required: true, message: '請選擇預估日期(ex:2000-01-01 20:00)' }]}
                >
                  <DatePicker placeholder="請選擇預估日期(ex:2000-01-01 20:00)"  
                    getPopupContainer={trigger => trigger.parentNode} 
                    style={{ width: '100%' }} 
                    format={'YYYY-MM-DD HH:mm'} 
                    showTime 
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="note"
                  label="備註"
                  rules={[{ required: false }]}
                >
                  <Input.TextArea rows={4} placeholder="輸入備註" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              {(order.finish===1)?null:
                <Button type="primary" htmlType="submit">送出</Button>
              }
            </Form.Item>
          </Form>
        </div>
      )
    } 
  }
}
