import React, { useEffect, useState, Component } from 'react';
import { Form, Input, Button, DatePicker, InputNumber, Radio, Row, Col, Breadcrumb, message, Modal } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import axios from 'axios';
export default class UpdateOrderModal extends Component {

    formRef = React.createRef()

    constructor(props) {
        super(props);
        this.state = {
            order: {}, // 初始化 order 為空物件
        };
    }

    // 當組件接收到新的 props 時會觸發此方法
    async componentDidUpdate(prevProps) {
        console.log('componentDidUpdate triggered');
        console.log('prevProps.data:', prevProps.data);
        console.log('this.props.data:', this.props.data);
        // 當傳入的 data 改變時，執行資料處理
        if (prevProps.data !== this.props.data) {

            const { order } = this.state;
            console.log('order', order.estimatedDate)
            const initialValues = {
                ...order,
                invoiceType: order.invoiceType != null ? order.invoiceType.toString() : null,
                invoiceAddrType: order.invoiceAddrType != null ? order.invoiceAddrType.toString() : null,
                customerBirth: order.customerBirth ? dayjs(order.customerBirth).utc() : null,
                estimatedDate: order.estimatedDate ? dayjs(order.estimatedDate).utc() : null,
                products: order.products.map(product => ({
                    productName: product.name,
                    productSpec: product.description,
                    productAmount: product.count,
                    productPrice: product.price,
                })),
            }
            this.formRef.current.setFieldsValue(initialValues)

            //this.processData(this.props.data);
        }
    }
    // 處理 data 並更新到 order state
    processData(data) {
        if (data) {
            const processedOrder = {
                ...data,
                processedDate: new Date(), // 舉例：新增一個處理日期
                // 這裡可以進行更多的資料處理
            };

            this.setState({ order: processedOrder });
        }
    }
    // async componentDidMount() {
    //     console.log(this.data)
    //     this.setState({ order: this.data }, () => {
    //         this.setInitialValues()
    //     })
    // }

    // setInitialValues = () => {
    //     if (this.formRef.current) {
    //         const { order } = this.state;
    //         console.log('order', order.estimatedDate)
    //         const initialValues = {
    //             ...order,
    //             invoiceType: order.invoiceType != null ? order.invoiceType.toString() : null,
    //             invoiceAddrType: order.invoiceAddrType != null ? order.invoiceAddrType.toString() : null,
    //             customerBirth: order.customerBirth ? dayjs(order.customerBirth).utc() : null,
    //             estimatedDate: order.estimatedDate ? dayjs(order.estimatedDate).utc() : null,
    //             products: order.products.map(product => ({
    //                 productName: product.name,
    //                 productSpec: product.description,
    //                 productAmount: product.count,
    //                 productPrice: product.price,
    //             })),
    //         }
    //         this.formRef.current.setFieldsValue(initialValues)
    //     }
    // }

    handleUpdate = () => {
        console.log('123')
    }


    render() {
        const { openModal, handleClose, data } = this.props;


        return (
            <Modal
                title="Vertically centered modal dialog"
                centered
                open={openModal}
                onOk={this.handleUpdate}
                onCancel={handleClose}
            >
                {data.customer}
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
                                <DatePicker placeholder="選擇日期(ex:2000-01-01)" style={{ width: '100%' }} format={'YYYY-MM-DD'} />
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
                                                label="產品名稱"
                                                rules={[{ required: true, message: '請輸入產品名稱' }]}
                                            >
                                                <Input placeholder="輸入產品名稱" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'productSpec']}
                                                label="規格"
                                                rules={[{ required: true, message: '請輸入規格' }]}
                                            >
                                                <Input placeholder="輸入規格" />
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
                                                        <Input placeholder="輸入數量" />
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
                                                            style={{ width: '100%', }}
                                                            placeholder="輸入金額"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                            <MinusCircleOutlined onClick={() => remove(name)} style={{ marginTop: '40px' }} />
                                        </Col>
                                    </Row>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        新增產品詳情
                                    </Button>
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
                                    style={{ width: '100%', }}
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
                                <DatePicker placeholder="請選擇預估日期(ex:2000-01-01 20:00)" style={{ width: '100%' }} format={'YYYY-MM-DD HH:mm'} showTime />
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
                        <Button type="primary" htmlType="submit">
                            送出
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}
// // ＴＯＤＯ 顯示產品 名稱、數量、金額、描述
// function UpdateOrderModal({ openModal, handleClose, data }) {
//     const [orderData, setOrderData] = useState()
//     useEffect(() => {
//         if (openModal && data) {
//             setOrderData(data)
//         }

//     }, [openModal, data])

//     function handleUpdate() {

//     }

//     return (
//         <Modal
//             title="Vertically centered modal dialog"
//             centered
//             open={openModal}
//             onOk={handleUpdate}
//             onCancel={handleClose}
//         >
//             {orderData &&
//                 <Form layout="vertical"
//                     initialValues={orderData}
//                 >
//                     <Row gutter={16}>
//                         <Col span={12}>
//                             <Form.Item
//                                 name="orderNum"
//                                 label="訂單編號(不可修改)"
//                                 rules={[{ required: true, message: '訂單編號' }]}
//                             >
//                                 <Input placeholder="請輸入訂單編號" readOnly />
//                             </Form.Item>
//                         </Col>
//                     </Row>
//                     <Row gutter={16}>
//                         <Col span={12}>
//                             <Form.Item
//                                 name="customer"
//                                 label="貴賓姓名"
//                                 rules={[{ required: true, message: '請輸入貴賓姓名' }]}
//                             >
//                                 <Input placeholder="先生/小姐" />
//                             </Form.Item>
//                         </Col>
//                         <Col span={12}>
//                             <Form.Item
//                                 name="customerBirth"
//                                 label="貴賓生日"
//                             >
//                                 <DatePicker placeholder="選擇日期(ex:2000-01-01)" style={{ width: '100%' }} format={'YYYY-MM-DD'} />
//                             </Form.Item>
//                         </Col>
//                     </Row>
//                     <Row gutter={16}>
//                         <Col span={12}>
//                             <Form.Item
//                                 name="phoneOne"
//                                 label="連絡電話1"
//                                 rules={[{ required: true, message: '請輸入連絡電話1' }]}
//                             >
//                                 <Input placeholder="輸入電話號碼1" />
//                             </Form.Item>
//                         </Col>
//                         <Col span={12}>
//                             <Form.Item
//                                 name="phoneTwo"
//                                 label="連絡電話2"
//                             >
//                                 <Input placeholder="輸入電話號碼2" />
//                             </Form.Item>
//                         </Col>
//                     </Row>
//                     <Row gutter={16}>
//                         <Col span={24}>
//                             <Form.Item
//                                 name="address"
//                                 label="送貨地址"
//                                 rules={[{ required: true, message: '請輸入送貨地址' }]}
//                             >
//                                 <Input placeholder="輸入送貨地址" />
//                             </Form.Item>
//                         </Col>
//                     </Row>
//                     <Row gutter={16}>
//                         <Col span={12}>
//                             <Form.Item
//                                 name="invoiceType"
//                                 label="發票"
//                                 rules={[{ required: true, message: '請選擇發票類型' }]}
//                             >
//                                 <Radio.Group>
//                                     <Radio value={1}>二聯</Radio>
//                                     <Radio value={2}>三聯</Radio>
//                                 </Radio.Group>
//                             </Form.Item>
//                         </Col>
//                     </Row>
//                     <Row gutter={16}>
//                         <Col span={12}>
//                             <Form.Item shouldUpdate={(prevValues, currentValues) => { return prevValues.invoiceType !== currentValues.invoiceType }}>
//                                 {({ getFieldValue }) => {
//                                     const invoiceType = getFieldValue('invoiceType');
//                                     return invoiceType === 2 && (
//                                         <Form.Item
//                                             name="invoiceTitle"
//                                             label="發票抬頭"
//                                             rules={[{ required: true, message: '輸入發票抬頭' }]}
//                                         >
//                                             <Input placeholder="輸入發票抬頭" />
//                                         </Form.Item>
//                                     )
//                                 }}
//                             </Form.Item>
//                         </Col>
//                         <Col span={12}>
//                             <Form.Item shouldUpdate={(prevValues, currentValues) => { return prevValues.invoiceType !== currentValues.invoiceType }}>
//                                 {({ getFieldValue }) => {
//                                     const invoiceType = getFieldValue('invoiceType');
//                                     return invoiceType === 2 && (
//                                         <Form.Item
//                                             name="invoiceID"
//                                             label="發票統編"
//                                             rules={[{ required: true, message: '輸入發票統編' }]}
//                                         >
//                                             <Input placeholder="輸入發票統編" />
//                                         </Form.Item>
//                                     )
//                                 }}
//                             </Form.Item>
//                         </Col>
//                     </Row>
//                     <Row gutter={16}>
//                         <Col span={12}>
//                             <Form.Item
//                                 name="invoiceAddrType"
//                                 label="發票配送方式"
//                                 rules={[{ required: true, message: '請選擇配送方式' }]}
//                             >
//                                 <Radio.Group>
//                                     <Radio value={1}>隨貨</Radio>
//                                     <Radio value={2}>寄送</Radio>
//                                 </Radio.Group>
//                             </Form.Item>
//                         </Col>
//                     </Row>
//                     <Row gutter={16}>
//                         <Col span={24}>
//                             <Form.Item shouldUpdate={(prevValues, currentValues) => { return prevValues.invoiceAddrType !== currentValues.invoiceAddrType }}>
//                                 {({ getFieldValue }) => {
//                                     const invoiceAddrType = getFieldValue('invoiceAddrType');
//                                     return invoiceAddrType === 2 && (
//                                         <Form.Item
//                                             name="invoiceAddr"
//                                             label="發票寄送地址"
//                                             rules={[{ required: true, message: '輸入發票寄送地址' }]}
//                                         >
//                                             <Input placeholder="輸入發票寄送地址" />
//                                         </Form.Item>
//                                     )
//                                 }}
//                             </Form.Item>
//                         </Col>
//                     </Row>
//                     <Form.List name="OrderItems">
//                         {(fields, { add, remove }) => (
//                             <>
//                                 {fields.map(({ name, key, isListField, fieldKey }) => (
//                                     <Row gutter={16} key={key}>
//                                         <Col xs={24} sm={24} md={6} lg={6} xl={6}>

//                                             <p>{isListField}</p>
//                                             <p>{fieldKey}</p>
//                                             {/* <Form.Item
//                                                 name={[name, 'name']}
//                                                 label="產品名稱"
//                                                 rules={[{ required: true, message: '請輸入產品名稱' }]}
//                                             >
//                                                 <p>{key}</p>
//                                                 <p>{name}</p>
//                                                 <p>{restField}</p>
//                                                 <Input placeholder="輸入產品名稱" />
//                                             </Form.Item>
//                                         </Col>
//                                         <Col xs={24} sm={24} md={6} lg={6} xl={6}>
//                                             <Form.Item

//                                                 name={[name, 'description']}
//                                                 label="規格"
//                                                 rules={[{ required: true, message: '請輸入規格' }]}
//                                             >
//                                                 <Input placeholder="輸入規格" />
//                                             </Form.Item>
//                                         </Col>
//                                         <Col xs={24} sm={24} md={10} lg={10} xl={10}>
//                                             <Row gutter={16}>
//                                                 <Col span={12}>
//                                                     <Form.Item
//                                                         {...restField}
//                                                         name={[name, 'count']}
//                                                         label="數量"
//                                                         rules={[{ required: true, message: '請輸入數量' }]}
//                                                     >
//                                                         <Input placeholder="輸入數量" />
//                                                     </Form.Item>
//                                                 </Col>
//                                                 <Col span={12}>
//                                                     <Form.Item
//                                                         {...restField}
//                                                         name={[name, 'productPrice']}
//                                                         label="金額"
//                                                         rules={[{ required: true, message: '請輸入金額' }]}
//                                                     >
//                                                         <InputNumber
//                                                             formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
//                                                             parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
//                                                             style={{ width: '100%', }}
//                                                             placeholder="輸入金額"
//                                                         />
//                                                     </Form.Item>
//                                                 </Col>
//                                             </Row>
//                                         </Col>
//                                         <Col xs={24} sm={24} md={2} lg={2} xl={2}>
//                                             <MinusCircleOutlined onClick={() => remove(name)} style={{ marginTop: '40px' }} /> */}
//                                         </Col>
//                                     </Row>

//                                 ))}
//                                 <Form.Item>
//                                     <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
//                                         新增產品詳情
//                                     </Button>
//                                 </Form.Item>
//                             </>
//                         )}
//                     </Form.List>
//                     <Row gutter={16}>
//                         <Col span={12}>
//                             <Form.Item
//                                 name="paymentTotal"
//                                 label="總計"
//                                 rules={[{ required: true, message: '請輸入總計金額' }]}
//                             >
//                                 <InputNumber
//                                     formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
//                                     parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
//                                     style={{ width: '100%', }}
//                                     placeholder="輸入總計金額"
//                                 />
//                             </Form.Item>
//                         </Col>
//                         <Col span={12}>
//                             {/* <Form.Item
//                             name="estimatedDate"
//                             label="預估出貨日期"
//                             rules={[{ required: true, message: '請選擇預估日期(ex:2000-01-01 20:00)' }]}
//                         >
//                             <DatePicker placeholder="請選擇預估日期(ex:2000-01-01 20:00)" style={{ width: '100%' }} format={'YYYY-MM-DD HH:mm'} showTime />
//                         </Form.Item> */}
//                         </Col>
//                     </Row>
//                     <Row gutter={16}>
//                         <Col span={24}>
//                             <Form.Item
//                                 name="note"
//                                 label="備註"
//                                 rules={[{ required: false }]}
//                             >
//                                 <Input.TextArea rows={4} placeholder="輸入備註" />
//                             </Form.Item>
//                         </Col>
//                     </Row>
//                     <Form.Item>
//                         <Button type="primary" htmlType="submit">
//                             送出
//                         </Button>
//                     </Form.Item>
//                 </Form>
//             }
//         </Modal>
//     )
// }

