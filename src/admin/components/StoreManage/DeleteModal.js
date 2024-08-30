import React, { useEffect } from 'react'
import axios from 'axios';
import { Modal, Form } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
function DeleteModal({ openModal, handleClose, data }) {
    const token = localStorage.getItem('token')
    const { confirm } = Modal;

    function deleteStore() {
        if (data.id === 1) {
            alert('總部不可刪除')
            handleClose()
        } else {
            axios.delete(`${process.env.REACT_APP_API_PATH}/api/admin/store/`, {
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

    }

    useEffect(() => {
        if (openModal && data) {
            confirm({
                title: '刪除門市',
                icon: <ExclamationCircleFilled />,
                content: (
                    <Form layout={{ labelCol: { span: 4 }, wrapperCol: { span: 14 } }}>
                        <p>刪除後無法復原，確定要刪除 {data.code} -{data.name} 嗎？</p>
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

export default DeleteModal