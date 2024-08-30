import React, { Component } from 'react';
import { Modal, Form, Input ,DatePicker ,Row, Col, } from 'antd';
import {FormOutlined} from '@ant-design/icons';

export default class ShipmentCreate extends Component {
    formRef = React.createRef()

    handleOk = () => {
        this.formRef.current.submit()
    }
    onFinish = (values) => {
        const utcShipmentDate = values.shipmentDate.format('YYYY-MM-DD HH:mm')
        this.props.onCreate({ ...values, returnShipOrder: this.props.choseOrder,shipmentDate: utcShipmentDate })
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
                        {`新增${choseOrder}的出貨單`}
                    </>
                }
                okText="新增"
                cancelText="取消"
                onCancel={onCancel}
                onOk={this.handleOk}
            >
                <Form ref={this.formRef} layout="vertical" name="form_in_modal" onFinish={this.onFinish}   initialValues={{ orderNum: choseOrder }} >
                <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="orderNum" label="訂單號" rules={[{ required: true}]}>
                                <Input style={{ width: '100%' }} readOnly />
                            </Form.Item>
                        </Col>
                        <Col span={16}>
                            <Form.Item name="shipmentDate" label="確認出貨時間" rules={[{ required: true, message: '請輸入出貨時間' }]}>
                                <DatePicker 
                                    placeholder="請選擇出貨日期(ex:2000-01-01 20:00)" 
                                    style={{ width: '100%' }} 
                                    format={'YYYY-MM-DD HH:mm'} 
                                    getPopupContainer={trigger => trigger.parentNode} 
                                    showTime 
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item name="note" label="備註">
                                <Input.TextArea placeholder="請輸入備註"  maxLength={255}  style={{ width: '100%',  height: '100px',resize: 'none'}}  autoSize={false}/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }
}
