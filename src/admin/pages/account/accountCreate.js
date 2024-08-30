import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Switch, Select, Row, Col, Breadcrumb } from 'antd';
import axios from 'axios';
import '../../css/orderForm.css'; // 引入CSS

function AccountCreate() {
    const token = localStorage.getItem('token')
    const [groups, setGroups] = useState([])
    const [groupId, setGroupId] = useState(null)
    const [name, setName] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [checkPw, setCheckPw] = useState(null)
    const [allStore, setAllStore] = useState([])
    const [store, setStore] = useState(null)
    const [account, setAccount] = useState(null)
    const [publish, setPublish] = useState(1)
    const [form] = Form.useForm();
    useEffect(() => {
        console.log('@', token)
        //取得權限列表
        axios.get(`${process.env.REACT_APP_API_PATH}/api/admin/user/list/group`, {
            headers: {
                Authorization: token
            },
        })
            .then(data => {
                setGroups(data.data.GroupId)
            }).catch(err => console.log(err))

        //取得門市列表
        axios.get(`${process.env.REACT_APP_API_PATH}/api/admin/user/list/store`, {
            headers: {
                Authorization: token
            },
        })
            .then(data => {
                setAllStore(data.data.store)
            }).catch(err => console.log(err))
    }, [])


    function handleSubmit() {
        if (password === checkPw) {

            axios.post(`${process.env.REACT_APP_API_PATH}/api/admin/user/`, { name, password, account, email, storeId: store, groupId, publish: publish ? 1 : 0 }, {
                headers: {
                    Authorization: token
                },
            })
                .then(data => {
                    form.resetFields();
                    setName(null);
                    setEmail(null);
                    setPassword(null);
                    setCheckPw(null);
                    setStore(null);
                    setAccount(null);
                    setPublish(1);
                    alert('建立成功')
                }).catch(err => {
                    console.log(err)
                    alert('建立失敗。' + err.response.data)
                })
        } else {
            alert('兩次密碼輸入不一致！')
        }


    }
    return (
        <div className="order-form-container" style={{ minHeight: '81vh' }}>
            <Breadcrumb
                items={[
                    { title: 'Home', href: '/admin' },
                    { title: '帳號管理' },
                    { title: '新增帳號' },
                ]}
            /><br />
            <Form form={form} layout="vertical" initialValues={{ size: 'large' }} onFinish={handleSubmit}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="使用者姓名"
                            rules={[{ required: true, message: '請輸入姓名' }]}
                        >
                            <Input placeholder="請輸入姓名" value={name}
                                onChange={e => setName(e.target.value)} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="account"
                            label="使用者帳號"
                            rules={[{ required: true, message: '請輸入使用者帳號' }]}
                        >
                            <Input placeholder="請輸入使用者帳號" value={account}
                                onChange={e => setAccount(e.target.value)} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="password"
                            label="密碼"
                            rules={[{ required: true, message: '請輸入密碼' }]}
                        >
                            <Input.Password placeholder="輸入密碼" value={password}
                                onChange={e => setPassword(e.target.value)} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="checkPw"
                            label="確認密碼"
                            rules={[{ required: true, message: '請再次輸入密碼' }]}
                        >
                            <Input.Password placeholder="請再次輸入密碼" value={checkPw}
                                onChange={e => setCheckPw(e.target.value)} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="email"
                            label="信箱"
                            rules={[{ required: true, message: '請輸入信箱' }]}
                        >
                            <Input placeholder="輸入信箱" value={email}
                                onChange={e => setEmail(e.target.value)} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="門市"
                            name="store"
                            rules={[{ required: true, message: '請選擇門市' }]}
                        >
                            <Select value={store} onChange={e => setStore(e)}>
                                {allStore.length > 0 &&
                                    allStore.map(each => { return (<Select.Option key={each.id} value={each.id}>{each.name}</Select.Option>) })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="權限"
                            name="group"
                            rules={[{ required: true, message: '請選擇權限' }]}
                        >
                            <Select onChange={(e) => setGroupId(e)} value={groupId}>
                                {groups.length > 0 &&
                                    groups.map(each => { return (<Select.Option key={each.id} value={each.id}>{each.groupName}</Select.Option>) })
                                }

                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24} style={{ padding: '20px' }}>
                    <Col xs={10} md={3} >
                        <Form.Item label="帳號啟用" layout='horizontal'>
                            <Switch value={publish} onChange={e => setPublish(e)} />
                        </Form.Item>
                    </Col>
                </Row>

                <Button type="primary" htmlType="submit">
                    送出
                </Button>

            </Form>
        </div>
    )
}

export default AccountCreate