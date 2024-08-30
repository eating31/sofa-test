import React, { useEffect } from 'react'
import axios from 'axios';
import { Modal, Form, Input } from 'antd';

function UpdateModal({ openModal, handleClose, data }) {
    const [form] = Form.useForm();
    const token = localStorage.getItem('token')

    useEffect(() => {
        console.log(data)
        if (openModal && data) {
            form.setFieldsValue({
                method: data.method,
                step: data.step,
            })
        }
    }, [data]);

    const updateStore = async () => {

        try {
            const values = await form.validateFields();
            const { method, step } = values;

            // 檢查是否有變更
            if (method === data.method &&
                step === data.step) {
                alert('沒有更新，無需存檔');
                handleClose();
                return;
            } else {
                axios.put(`${process.env.REACT_APP_API_PATH}/api/admin/process/item`, { method, step, id: data.id }, {
                    headers: {
                        Authorization: token
                    },
                }).then(data => {
                    console.log(data)
                    alert('儲存成功！')
                    handleClose();
                }).catch(err => {
                    console.log(err)
                    alert('更新失敗')
                })
            }
        } catch (err) {
            if (err.errorFields) {
                // 這裡處理表單的錯誤字段
                console.log('Validation Errors:', err.errorFields);
                err.errorFields.forEach(field => {
                    alert(`更新失敗: ${field.errors}`)
                });
            }

        }
    }

    return (
        <Modal
            title="更新使用者資料"
            centered
            open={openModal}
            onOk={updateStore}
            okText='存檔'
            cancelText='取消'
            onCancel={handleClose}
        >
            <Form form={form} layout="horizontal" style={{ padding: '20px' }} initialValues={{
                method: data?.method,
                step: data?.step,
            }}>
                <Form.Item label="項目" name="method" rules={[{ required: true, message: '請輸入項目' }]}>
                    <Input placeholder="請輸入項目" />
                </Form.Item>
                <Form.Item label="步驟" name="step" rules={[{ required: true, message: '請輸入步驟' }]}>
                    <Input placeholder="請輸入步驟" />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default UpdateModal;
