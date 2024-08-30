import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Modal, Form, Input } from 'antd';

function EditModal({ openModal, handleClose, data }) {
    const token = localStorage.getItem('token')
    const [name, setName] = useState();
    const [code, setCode] = useState();
    const [url, setUrl] = useState();
    useEffect(() => {
        if (openModal && data) {
            setCode(data.code)
            setName(data.name)
            setUrl(data.url)
        }

    }, [data]);

    //判斷是門市代號是否為英文大寫
    function isAllUppercaseEnglish(str) {
        const uppercaseRegex = /^[A-Z]+$/;
        return uppercaseRegex.test(str);
    }

    function updateStore() {
        // 參數判斷
        if (!isAllUppercaseEnglish(code)) {
            alert('門市代號只能為英文大寫！')
            return
        } else if (!name || !url) {
            alert('門市名稱和Line連結為必填欄位！')
            return
        } else if (name === data.name && url === data.url && code === data.code) {
            alert('沒有更新無需存檔')
            handleClose()
        }
        else {
            // 更新要記錄修改者嗎？ 還是紀錄建立者就好？
            axios.put(`${process.env.REACT_APP_API_PATH}/api/admin/store/`, { code, name, url, id: data.id, originCode: data.code }, {
                headers: {
                    Authorization: token
                },
            })
                .then(data => {
                    //console.log(data)
                    alert('儲存成功！')
                    handleClose()
                }).catch(err => {
                    alert(err.response.data)
                    console.log(err)
                })
        }
    }
    return (
        <Modal
            title="更新門市資料"
            centered
            open={openModal}
            onOk={updateStore}
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

export default EditModal