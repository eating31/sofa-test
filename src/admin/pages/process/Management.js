import React, { useEffect, useState } from 'react'
import { Table, Breadcrumb, Space, Button, Flex, message } from 'antd';
import moment from 'moment';
import '../../css/orderForm.css'; // 引入CSS
import axios from 'axios';
import { getColumnSearchProps } from '../../utils/tableSerach'; // 引入表格搜尋方法
import UpdateModal from '../../components/Process/ItemManage/UpdateModal';
import DeleteModal from '../../components/Process/ItemManage/DeleteModal';
import CreateModal from '../../components/Process/ItemManage/CreateModal';
import { authError } from '../../utils/jwt';
const { Column } = Table;

function Management() {

    const [nodes, setNodes] = useState([])
    const token = localStorage.getItem('token')

    const [openCreatedModal, setOpenCreatedModal] = useState(false)
    const [openUpdatedModal, setOpenUpdatedModal] = useState(false)
    const [openDeletedModal, setOpenDeletedModal] = useState(false)
    const [selectNode, setSelectNode] = useState(null)


    function getAllNode() {
        axios.get(`${process.env.REACT_APP_API_PATH}/api/admin/process/item`, {
            headers: {
                Authorization: token
            },
        })
            .then(data => {
                console.log(data)
                setNodes(data.data.nodes)
            }).catch(err => {
                // 權限錯誤
                if (err.response?.status === 401) {
                    authError(err.response)
                }
                console.log(err)
            })
    }

    useEffect(() => {
        getAllNode()
    }, [])



    function handleClose() {
        setOpenUpdatedModal(false)
        setOpenDeletedModal(false)
        setOpenCreatedModal(false)
        getAllNode()
    }

    function handleEdit(data) {
        if (data.id === 1) {
            alert('無法修改預設廠長品檢！')
            return
        } else {
            setOpenUpdatedModal(true)
            setSelectNode(data)
        }
    }

    function handleDelete(data) {
        if (data.id === 1) {
            alert('無法刪除預設廠長品檢！')
            return
        } else {
            setOpenDeletedModal(true)
            setSelectNode(data)
        }

    }

    return (
        <div className="order-form-container" style={{ minHeight: '84vh' }}>
            <Flex justify='space-between'>
                <Breadcrumb
                    items={[
                        { title: 'Home', href: '/admin' },
                        { title: '製程管理' },
                        { title: '節點管理' },
                    ]}
                />
                <Button type="primary" onClick={() => setOpenCreatedModal(true)}>＋{' '}新增製程節點</Button>
            </Flex>

            <br />

            <Table dataSource={nodes} rowKey="id" scroll={{ x: 'max-content' }}>
                <Column title="#" dataIndex="index" key="index"
                    sorter={(a, b) => a.index - b.index} />
                <Column title="項目" dataIndex="method" key="method" {...getColumnSearchProps('method')} />
                <Column title="步驟" dataIndex="step" key="step" {...getColumnSearchProps('step')} />
                <Column title="建立者" dataIndex="triggerBy" key="triggerBy"
                    render={(text, record) => record?.CreateProcessItemUser?.name} />
                <Column title="更新者" dataIndex="updatedBy" key="updatedBy" align='center'
                    render={(text, record) => record.UpdateProcessItemUser ? record?.UpdateProcessItemUser?.name : '-'} />
                <Column title="建立時間" dataIndex="createdAt" key="createdAt"
                    render={(text, record) => moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                    sorter={(a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix()} />
                <Column title="更新時間" dataIndex="updatedAt" key="updatedAt" align='center'
                    render={(text, record) => record.UpdateProcessItemUser ? moment(record.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}
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
            <UpdateModal openModal={openUpdatedModal} handleClose={handleClose} data={selectNode} />
            <DeleteModal openModal={openDeletedModal} handleClose={handleClose} data={selectNode} />
        </div>
    )
}

export default Management