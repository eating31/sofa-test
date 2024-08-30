import React, { useState } from 'react'
import axios from 'axios';
import { Modal, Form, Input } from 'antd';
function CreateModal({ openModal, handleClose }) {
    const token = localStorage.getItem('token')
    const [name, setName] = useState();
    const [code, setCode] = useState();
    const [url, setUrl] = useState();

    //判斷是門市代號是否為英文大寫
    function isAllUppercaseEnglish(str) {
        const uppercaseRegex = /^[A-Z]+$/;
        return uppercaseRegex.test(str);
    }

    function createStore() {
        // 參數判斷
        if (!isAllUppercaseEnglish(code)) {
            alert('門市代號只能為英文大寫！')
            return
        } else if (!name || !url) {
            alert('門市名稱和Line連結為必填欄位！')
            return
        } else {
            axios.post(`${process.env.REACT_APP_API_PATH}/api/admin/store/`, { code, name, url }, {
                headers: {
                    Authorization: token
                },
            })
                .then(data => {
                    //console.log(data)
                    alert('建立成功！')
                    handleClose()
                }).catch(err => {
                    alert('門市建立失敗', err.response?.data)
                    console.log(err)
                }).finally(() => {
                    setCode(null)
                    setName(null)
                    setUrl(null)
                })
        }
    }
    return (
        <Modal
            title="建立新門市"
            centered
            open={openModal}
            onOk={createStore}
            okText='存檔'
            cancelText='取消'
            onCancel={handleClose}
        >
            <Form layout={{ labelCol: { span: 4 }, wrapperCol: { span: 14 } }} style={{ padding: '20px' }} >
                <Form.Item label="門市代號" >
                    <Input placeholder="請輸入門市英文代號" value={code} onChange={(e) => setCode(e.target.value)} />
                </Form.Item>
                <Form.Item label="門市名稱">
                    <Input placeholder="請輸入門市名稱" value={name} onChange={(e) => setName(e.target.value)} />
                </Form.Item>
                <Form.Item label="Line連結">
                    <Input placeholder="請輸入Line連結" value={url} onChange={(e) => setUrl(e.target.value)} />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default CreateModal