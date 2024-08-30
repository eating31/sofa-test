import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Modal, Form, Input, Select } from 'antd';

function AccountUpdateModal({ openModal, handleClose, data }) {
    const [form] = Form.useForm();
    const token = localStorage.getItem('token')

    const [stores, setStores] = useState([])
    const [groups, setGroups] = useState([])

    useEffect(() => {
        console.log(data)
        if (openModal && data) {
            form.setFieldsValue({
                email: data.email,
                name: data.name,
                account: data.account,
                groupId: data.groupId,
                storeId: data.storeId,
            });

            //取得權限列表
            axios.get(`${process.env.REACT_APP_API_PATH}/api/admin/user/list/group`, {
                headers: {
                    Authorization: token
                },
            })
                .then(data => {
                    console.log(data.data)
                    setGroups(data.data.GroupId)
                }).catch(err => console.log(err))

            //取得門市列表
            axios.get(`${process.env.REACT_APP_API_PATH}/api/admin/user/list/store`, {
                headers: {
                    Authorization: token
                },
            })
                .then(data => {
                    setStores(data.data.store)
                }).catch(err => console.log(err))
        }

    }, [data]);

    const updateStore = async () => {

        try {
            const values = await form.validateFields();
            const { name, account, email, storeId, groupId } = values;
            console.log(name, account, email)

            // 檢查是否有變更
            if (name === data.name &&
                account === data.account &&
                email === data.email &&
                storeId === data.storeId &&
                groupId === data.groupId) {
                alert('沒有更新無需存檔');
                handleClose();
                return;
            } else {
                axios.put(`${process.env.REACT_APP_API_PATH}/api/admin/user/`, { name, account, id: data.id, email, storeId, groupId }, {
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
                email: data?.email,
                name: data?.name,
                account: data?.account,
                groupId: data?.groupId,
                storeId: data?.storeId
            }}>
                <Form.Item label="使用者帳號" name="account" rules={[{ required: true, message: '請輸使用者帳號' }]}>
                    <Input placeholder="請輸使用者帳號" />
                </Form.Item>
                <Form.Item label="使用者名稱" name="name" rules={[{ required: true, message: '請輸入使用者名稱' }]}>
                    <Input placeholder="請輸入使用者名稱" />
                </Form.Item>
                <Form.Item label="Email" name="email" rules={[{ required: true, message: '請輸入Email' }]}>
                    <Input placeholder="請輸入Email" />
                </Form.Item>
                <Form.Item label="門市" name="storeId" rules={[{ required: true, message: '請選擇門市' }]}>
                    <Select>
                        {stores.length > 0 &&
                            stores.map(each => <Select.Option key={each.id} value={each.id}>{each.name}</Select.Option>)
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="權限" name="groupId" rules={[{ required: true, message: '請選擇權限' }]}>
                    <Select>
                        {groups.length > 0 &&
                            groups.map(each => <Select.Option key={each.id} value={each.id}>{each.groupName}</Select.Option>)
                        }
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default AccountUpdateModal;
