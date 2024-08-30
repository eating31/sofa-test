import React, { useEffect } from 'react'
import axios from 'axios';
import { Modal, Form } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
function AccountDeleteModal({ openModal, handleClose, data }) {
    const token = localStorage.getItem('token')
    const { confirm } = Modal;

    function deleteStore() {
        axios.delete(`${process.env.REACT_APP_API_PATH}/api/admin/user`, {
            headers: {
                Authorization: token
            },
            data: {
                id: data.id
            }
        })
            .then(data => {
                alert('刪除成功！')
                handleClose()
            }).catch(err => {
                alert(err.response.data)
                console.log(err)
            })
    }

    useEffect(() => {
        if (openModal && data) {
            confirm({
                title: '刪除門市',
                icon: <ExclamationCircleFilled />,
                content: (
                    <Form layout={{ labelCol: { span: 4 }, wrapperCol: { span: 14 } }}>
                        <p>刪除後無法復原，確定要刪除 {data.account} -{data.name} 使用者嗎？</p>
                    </Form>
                ),
                okText: '確定刪除',
                open: { openModal },
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    deleteStore()
                },
                onCancel() {
                    handleClose()
                },
            });

        }
    }, [data]);
    return (
        <div>
        </div>
    )
}

export default AccountDeleteModal