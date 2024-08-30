import React, { useEffect, useState } from 'react';
import { Space, Table, Button, Breadcrumb, Flex } from 'antd';
import axios from 'axios';
import '../../css/orderForm.css'; // 引入CSS
import moment from 'moment';
import CreateModal from '../../components/StoreManage/CreateModal';
import EditModal from '../../components/StoreManage/EditModal';
import DeleteModal from '../../components/StoreManage/DeleteModal';
import { getColumnSearchProps } from '../../utils/tableSerach'; // 引入表格搜尋方法
import { authError } from '../../utils/jwt';
const { Column } = Table;

function StoreManage() {
    const [openCreatedModal, setOpenCreatedModal] = useState(false)
    const [openUpdatedModal, setOpenUpdatedModal] = useState(false)
    const [openDeletedModal, setOpenDeletedModal] = useState(false)

    const token = localStorage.getItem('token')
    const [data, setData] = useState([])
    const [selectStore, setSelectStore] = useState(null)

    function getAllStore() {
        axios.get(`${process.env.REACT_APP_API_PATH}/api/admin/store/`, {
            headers: {
                Authorization: token
            },
        })
            .then(data => {
                console.log(data)
                setData(data.data.stores)
            }).catch(err => {
                // 權限錯誤
                if (err.response?.status === 401) {
                    authError(err.response)
                }
                console.log(err)
            })
    }

    useEffect(() => {
        getAllStore()
    }, [])

    function handleClose() {
        setSelectStore(null)
        setOpenCreatedModal(false)
        setOpenUpdatedModal(false)
        setOpenDeletedModal(false)
        getAllStore()
    }

    function handleEdit(data) {
        setOpenUpdatedModal(true)
        setSelectStore(data)
    }

    function handleDelete(data) {
        setOpenDeletedModal(true)
        setSelectStore(data)
    }

    return (
        <div style={{ minHeight: '84vh' }} className="order-form-container">
            <Flex justify='space-between'>
                <Breadcrumb
                    items={[
                        { title: 'Home', href: '/admin' },
                        { title: '門市管理' }
                    ]}
                />
                <Button type="primary" onClick={() => setOpenCreatedModal(true)}>＋{' '}新增門市</Button>
            </Flex>
            <br />

            <Table dataSource={data} rowKey="id" scroll={{ x: 'max-content' }}>
                <Column title="#" dataIndex="index" key="index" />
                <Column title="門市代號" dataIndex="code" key="code" {...getColumnSearchProps('code')} />
                <Column title="門市名稱" dataIndex="name" key="name" {...getColumnSearchProps('name')} />
                <Column title="Line url" dataIndex="url" key="url" {...getColumnSearchProps('url')} />
                <Column title="建立者" dataIndex="CreateStoreUser" key="CreateStoreUser"
                    render={(text, record) => record?.CreateStoreUser?.name} />
                <Column title="更新者" dataIndex="UpdateStoreUser" key="UpdateStoreUser" align='center'
                    render={(text, record) => record.UpdateStoreUser ? record?.UpdateStoreUser?.name : '-'} />
                <Column title="建立時間" dataIndex="createdAt" key="createdAt"
                    render={(text, record) => moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                    sorter={(a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix()} />
                <Column title="更新時間" dataIndex="updatedAt" key="updatedAt" align='center'
                    render={(text, record) => record?.UpdateStoreUser ? moment(record.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}
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
            <CreateModal openModal={openCreatedModal} handleClose={handleClose} />
            <EditModal openModal={openUpdatedModal} handleClose={handleClose} data={selectStore} />
            <DeleteModal openModal={openDeletedModal} handleClose={handleClose} data={selectStore} />
        </div>
    )
}

export default StoreManage