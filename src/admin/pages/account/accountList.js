import React, { useEffect, useState, useRef } from 'react';
import { Space, Table, Switch, Breadcrumb, Button, Input } from 'antd';
import axios from 'axios';
import moment from 'moment';
import '../../css/orderForm.css'; // 引入CSS
import AccountDeleteModal from '../../components/AccountManage/AccountDeleteModal';
import AccountUpdateModal from '../../components/AccountManage/AccountUpdateModal';
import { getColumnSearchProps } from '../../utils/tableSerach'; // 引入表格搜尋方法
import { authError } from '../../utils/jwt'
const { Column } = Table;


function AccountList() {
    const token = localStorage.getItem('token')
    const [data, setData] = useState([])

    const [openUpdatedModal, setOpenUpdatedModal] = useState(false)
    const [openDeletedModal, setOpenDeletedModal] = useState(false)
    const [selectUser, setSelectUser] = useState(null)

    function getAllUer() {
        axios.get(`${process.env.REACT_APP_API_PATH}/api/admin/user/list`, {
            headers: {
                Authorization: token
            },
        })
            .then(data => {
                console.log(data)
                setData(data.data.users)
            }).catch(err => {
                // 權限錯誤
                if (err.response?.status === 401) {
                    authError(err.response)
                }
                console.log(err)
            })

    }

    useEffect(() => {
        getAllUer()
    }, [])

    const handlePublishChange = (checked, record) => {
        console.log(`Record ${record.id} publish status changed to ${checked}`);
        axios.put(`${process.env.REACT_APP_API_PATH}/api/admin/user/`, { id: record.id, publish: checked ? 1 : 0 }, {
            headers: {
                Authorization: token
            },
        }).then(data => {
            console.log(data)
            alert('狀態更新成功！')
            getAllUer()
        }).catch(err => {
            console.log(err)
            alert('狀態更新失敗')
        })
    };


    function handleClose() {
        setOpenUpdatedModal(false)
        setOpenDeletedModal(false)
        getAllUer()
    }

    function handleEdit(data) {
        setOpenUpdatedModal(true)
        setSelectUser(data)
    }

    function handleDelete(data) {
        if (data.id === 1) {
            alert('無法刪除初始系統管理員！')
            return
        } else {
            setOpenDeletedModal(true)
            setSelectUser(data)
        }

    }

    return (
        <div style={{ minHeight: '84vh' }} className="order-form-container">
            <Breadcrumb
                items={[
                    { title: 'Home', href: '/admin' },
                    { title: '帳號管理' },
                    { title: '帳號列表' },
                ]}
            /><br />

            <Table dataSource={data} rowKey="id" scroll={{ x: 'max-content' }}>
                <Column title="#" key="index" dataIndex="index" />
                <Column title="名稱" dataIndex="name" key="name" {...getColumnSearchProps('name')} />
                <Column title="帳號" dataIndex="account" key="account" {...getColumnSearchProps('account')} />
                <Column title="信箱" dataIndex="email" key="email" {...getColumnSearchProps('email')} />
                <Column title="門市" dataIndex="store" key="Staff"
                    render={(text, record) => record.Staff?.name} />
                <Column title="權限" dataIndex="Group" key="Group"
                    render={(text, record) => record.Group?.groupName} />
                <Column title="停權" dataIndex="publish" key="publish"
                    render={(text, record) => (
                        <Switch
                            checked={record.publish}
                            onChange={(checked) => handlePublishChange(checked, record)}
                        />
                    )}
                />
                <Column title="建立者" dataIndex="CreatedUser" key="CreatedUser"
                    render={(text, record) => record.Created?.name} />
                <Column title="更新者" dataIndex="Updated" key="Updated" align='center'
                    render={(text, record) => record.Updated ? record.Updated?.name : '-'} />
                <Column title="建立時間" dataIndex="createdAt" key="createdAt"
                    render={(text, record) => moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                    sorter={(a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix()} />
                <Column title="更新時間" dataIndex="updatedAt" key="updatedAt" align='center'
                    render={(text, record) => record.Updated ? moment(record.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}
                    sorter={(a, b) => moment(a.updatedAt).unix() - moment(b.updatedAt).unix()} />
                <Column
                    title="管理"
                    key="action"
                    render={(_, record) => (
                        <Space size="middle">
                            <Button type="primary" ghost onClick={(e) => handleEdit(record)}>編輯</Button>
                            <Button danger onClick={(e) => handleDelete(record)}>刪除 </Button>
                        </Space>
                    )}
                />
            </Table>
            <AccountDeleteModal openModal={openDeletedModal} handleClose={handleClose} data={selectUser} />
            <AccountUpdateModal openModal={openUpdatedModal} handleClose={handleClose} data={selectUser} />
        </div>
    )
};
export default AccountList;