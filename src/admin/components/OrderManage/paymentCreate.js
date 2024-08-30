import React, { Component } from 'react';
import { Modal, Form, Input ,DatePicker ,Row, Col,Select,InputNumber } from 'antd';
import {FormOutlined} from '@ant-design/icons';

export default class paymentCreate extends Component {
    formRef = React.createRef()
    handleOk = () => {
        this.formRef.current.submit()
    }
    onFinish = (values) => {
        this.props.onCreate({ ...values, returnPayOrder: this.props.choseOrder,paidDate:values.paidDate.format('YYYY-MM-DD') })
        this.formRef.current.resetFields()
    }
    render() {
        const { open,onCancel ,choseOrder} = this.props
        return (
            <Modal
                open={open}
                title={
                    <>
                        <FormOutlined style={{ marginRight: 8 }} />
                        {`新增${choseOrder}的付款單`}
                    </>
                }
                okText="新增"
                cancelText="取消"
                onCancel={onCancel}
                onOk={this.handleOk}
            >
                <Form ref={this.formRef} layout="vertical" name="form_in_modal" onFinish={this.onFinish}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="paidDate" label="付款時間" rules={[{ required: true, message: '請輸入付款時間' }]}>
                                <DatePicker style={{ width: '100%' }} getPopupContainer={trigger => trigger.parentNode} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="type" label="付款方式" rules={[{ required: true, message: '請輸入付款方式' }]}>
                                <Select
                                    style={{width: '100%',}}
                                    options={[
                                        {value: 1,label: '匯款',},
                                        {value: 2,label: '刷卡',},
                                        {value: 3,label: '其他',},
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="price" label="付款金額" rules={[{ required: true, message: '請輸入付款金額' }]}>
                                <InputNumber
                                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                                    style={{width: '100%',}}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="note" label="備註" rules={[{ required: false, message: '請輸入備註' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }
}
