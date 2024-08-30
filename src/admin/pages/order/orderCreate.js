import React, { Component } from 'react';
import { Form, Input, Button, DatePicker, InputNumber, Radio, Row, Col, Breadcrumb, message, Upload, Modal } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import '../../css/orderForm.css'; // 引入CSS

export default class OrderForm extends Component {
    formRef = React.createRef();
    token = localStorage.getItem('token');

    state = {
        fileList: [],
        previewImage: '',
        previewVisible: false,
        previewTitle: '',
    }

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    handleChange = ({ fileList }) => this.setState({ fileList });

    getBase64 = file =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });

    onFinish = async(values) => {
        const formData = new FormData();
        this.state.fileList.forEach(file => {
            formData.append('image', file.originFileObj);
        });

        const formattedValues = {
            ...values,
            products: JSON.stringify(values.products) ,
            customerBirth: values.customerBirth ? values.customerBirth.format('YYYY-MM-DD') : null,
            estimatedDate: values.estimatedDate ? values.estimatedDate.format('YYYY-MM-DD HH:mm') : null,
        };
        console.log('formattedValues',formattedValues)

        for (const key in formattedValues) {
            if (formattedValues[key] !== undefined && formattedValues[key] !== null) {
                formData.append(key, formattedValues[key]);
            }
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_PATH}/api/admin/order`, formData, {
                headers: {
                    Authorization: this.token,
                    'Content-Type': 'multipart/form-data'
                },
            });

            if (response.status === 200) {
                message.success('訂單創建成功');
                this.props.navigate(`/admin/Order/OrderList`);
            } else {
                message.error('訂單創建失敗');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                message.error(error.response.data.error);
            } else {
                message.error('其他錯誤');
            }
        }
    }

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        return (
            <div className="order-form-container">
                <Breadcrumb
                    items={[
                        { title: '首頁', href: '/admin' },
                        { title: '訂單管理' },
                        { title: '新增訂單' },
                    ]}
                /><br />
                <Form ref={this.formRef} layout="vertical" onFinish={this.onFinish} initialValues={{ products: [{}] }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="orderNum"
                                label="訂單編號"
                                rules={[{ required: true, message: '訂單編號不能為空' }]}
                            >
                                <Input placeholder="請輸入訂單編號" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="upload"
                                label="上傳紙本訂單"
                            >
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleChange}
                                    beforeUpload={(file) => {
                                        const isImage = file.type.startsWith('image/');
                                        if (!isImage) {
                                            message.error('只能上傳圖片格式的檔案');
                                            return false; // 阻止非圖片格式檔案的上傳
                                        }
                                        return false; // 阻止自動上傳，需手動處理上傳
                                    }}
                                >
                                    {fileList.length >= 1 ? null : <div>
                                        <UploadOutlined />
                                        <div style={{ marginTop: 8 }}>上傳</div>
                                    </div>}
                                </Upload>
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
                                <DatePicker placeholder="選擇日期(ex:2000-01-01)" style={{ width: '100%' }} getPopupContainer={trigger => trigger.parentNode} format={'YYYY-MM-DD'} />
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
                                label="發票類型"
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
                                    const invoiceType = getFieldValue('invoiceType')
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
                                    const invoiceAddrType = getFieldValue('invoiceAddrType')
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
                                                            style={{ width: '100%' }}
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
                                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!ψd))/g, ',')}
                                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                                    style={{ width: '100%' }}
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
                                <DatePicker placeholder="請選擇預估日期(ex:2000-01-01 20:00)" getPopupContainer={trigger => trigger.parentNode} style={{ width: '100%' }} format={'YYYY-MM-DD HH:mm'} showTime />
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
                 {/* 預覽圖片的 Modal */}
                <Modal
                    open={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={() => this.setState({ previewVisible: false })}
                    width="90%" 
                    style={{ maxWidth: '1000px' }} 
                >
                    <img 
                    alt="previewImage"
                    style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}  
                    src={previewImage} 
                    />
                </Modal>
            </div>
        );
    }
}
