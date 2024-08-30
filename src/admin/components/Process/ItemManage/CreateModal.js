import React, { useState } from 'react'
import axios from 'axios';
import { Modal, Form, Input } from 'antd';
function CreateModal({ openModal, handleClose }) {
    const token = localStorage.getItem('token')
    const [method, setMethod] = useState();
    const [step, setStep] = useState();

    function createNode() {
        if (!method || !step) {
            alert('項目和步驟為必填欄位！')
            return
        } else {
            axios.post(`${process.env.REACT_APP_API_PATH}/api/admin/process/item`, { method, step }, {
                headers: {
                    Authorization: token
                },
            })
                .then(data => {
                    //console.log(data)
                    alert('建立成功！')
                    handleClose()
                }).catch(err => {
                    alert('製程節點建立失敗', err.response?.data)
                    console.log(err)
                }).finally(() => {
                    setMethod(null)
                    setStep(null)
                })
        }
    }
    return (
        <Modal
            title="建立新製程節點"
            centered
            open={openModal}
            onOk={createNode}
            okText='存檔'
            cancelText='取消'
            onCancel={handleClose}
        >
            <Form layout={{ labelCol: { span: 4 }, wrapperCol: { span: 14 } }} style={{ padding: '20px' }} >
                <Form.Item label="項目" >
                    <Input placeholder="請輸入項目" value={method} onChange={(e) => setMethod(e.target.value)} />
                </Form.Item>
                <Form.Item label="步驟">
                    <Input placeholder="請輸入步驟" value={step} onChange={(e) => setStep(e.target.value)} />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default CreateModal