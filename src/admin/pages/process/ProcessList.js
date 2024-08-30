import React, { useEffect, useState } from 'react'
import { Table, Breadcrumb, Space, Button, Modal, Badge } from 'antd';
import moment from 'moment';
import '../../css/orderForm.css'; // 引入CSS
import axios from 'axios';
import { getColumnSearchProps } from '../../utils/tableSerach'; // 引入表格搜尋方法
import { authError, checkJwt } from '../../utils/jwt';
import CreateProductProcess from '../../components/Process/List/CreateProductProcess';
import { ExclamationCircleFilled } from '@ant-design/icons';
import UpdateOrderModal from '../../components/Process/List/UpdateOrderModal';
const { confirm } = Modal;
const { Column } = Table;

function ProcessList() {
    const [nodes, setNodes] = useState([])
    const token = localStorage.getItem('token')
    const [role, setRole] = useState(0)

    const [openCreatedModal, setOpenCreatedModal] = useState(false)
    const [openUpdatedModal, setOpenUpdatedModal] = useState(false)
    const [selectData, setSelectData] = useState()

    function getOrder() {
        axios.get(`${process.env.REACT_APP_API_PATH}/api/admin/process/manage`, {
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
        getOrder()
        // 查看使用者權限
        checkJwt(token).then(data => setRole(data.role))
    }, [])

    function handleClose() {
        setOpenCreatedModal(false)
        setOpenUpdatedModal(false)
        getOrder()
    }

    function handleAddProductProcess(data) {
        setOpenCreatedModal(true)
        setSelectData(data)
    }

    const showConfirm = (record) => {
        confirm({
            title: `請問確定要刪除${record.orderNum}訂單嗎？`,
            icon: <ExclamationCircleFilled />,
            content: '若刪除訂單，已完成的製程步驟將無法復原',
            onOk() {
                handleDelete(record.orderNum)
            },
            onCancel() {
                // setOpen(false)
                // handleClose()
            },
        });
    };

    function handleDelete(orderNum) {
        axios.delete(`${process.env.REACT_APP_API_PATH}/api/admin/process/manage`, {
            headers: {
                Authorization: token
            },
            data: {
                orderNum
            }
        })
            .then(data => {
                alert('刪除成功！')
                getOrder()
            }).catch(err => {
                alert(err.response.data)
                console.log(err)
            })

    }

    function handleUpdate(record) {
        window.location.href = `/admin/Order/OrderUpdate/${record.orderNum}`
    }

    function uploadPhoto(id) {
        window.location.href = `/admin/Process/Start/${id}`
    }

    // 完成度計算 已完成製程數量（有上傳圖片）/全部的製程數量
    function completeCount(data) {
        console.log(data)
        let total = 0
        let count = 0
        data.OrderItems.map(item => {
            item.Product.ProductRecords.map(process => {
                total++
                if (process.finish === 1) {
                    count++
                }
            })
        })
        return <span>{count}/{total}</span>
    }


    function checkOrder(data) {
        let total = 0
        let count = 0
        data.OrderItems.map(item => {
            item.Product.ProductRecords.map(process => {
                total++
                if (process.finish === 1) {
                    count++
                }
            })
        })
        if (total === count) {
            axios.put(`${process.env.REACT_APP_API_PATH}/api/admin/process/manage/check`, { orderNum: data.orderNum }, {
                headers: {
                    Authorization: token
                },
            }).then(data => {
                console.log(data)
                alert('確認成功！')
                handleClose();
            }).catch(err => {
                console.log(err)
                alert('更新失敗')
            })
        } else {
            alert(`尚有${total - count}個製程節點未完成`)
        }

    }


    function checkOrderStates(record) {
        if (record.state === 1) {
            return <Badge status="warning" text="待開工" />
        } else if (record.state === 2) {
            return <Badge status="processing" text="製程進行" />
        } else if (record.state === 3) {
            return <Badge status="processing" text='廠長已檢核' />
        } else if (record.state === 4) {
            return <Badge status="processing" text='出貨安排' />
        } else if (record.state === 5) {
            return <Badge status="success" text='訂單結案' />
        }
    }

    return (
        <div className="order-form-container" style={{ minHeight: '84vh' }}>
            <Breadcrumb
                items={[
                    { title: 'Home', href: '/admin' },
                    { title: '製程管理' },
                    { title: '開工作業' },
                ]}
            />
            <br />

            <Table dataSource={nodes} rowKey="orderNum" scroll={{ x: 'max-content' }}>
                <Column title="#" dataIndex="index" key="index"
                    sorter={(a, b) => a.index - b.index} />
                <Column title="訂單編號" dataIndex="orderNum" key="orderNum" {...getColumnSearchProps('orderNum')} />
                <Column title="客戶名稱" dataIndex="customer" key="customer" {...getColumnSearchProps('customer')} />
                <Column title="訂單狀態" dataIndex="state" key="state" {...getColumnSearchProps('state')}
                    render={(text, record) => checkOrderStates(record)}
                />
                <Column title="產品名稱" dataIndex="Product" key="Product"
                    render={(text, record) =>
                    (
                        <>
                            {record.OrderItems.map((each, index) => (
                                <p key={each.id}>
                                    {index + 1}. {each.Product.name} x {each.Product.count}
                                </p>
                            ))}
                        </>
                    )}
                />
                <Column title="建立時間" dataIndex="createdAt" key="createdAt"
                    render={(text, record) => moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                    sorter={(a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix()} />
                <Column title="更新者" dataIndex="updatedBy" key="updatedBy" align='center'
                    render={(text, record) => record.UpdateOrderUser ? record?.UpdateOrderUser?.name : '-'} />
                <Column title="更新時間" dataIndex="updatedAt" key="updatedAt" align='center'
                    render={(text, record) => record.updatedAt === record.createdAt ? <span>-</span> : moment(record.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                    sorter={(a, b) => moment(a.updatedAt).unix() - moment(b.updatedAt).unix()} />
                <Column title="完成度" dataIndex="complete" key="complete" align='center'
                    render={(text, record) => record.state === 1 ? <span>-</span> : completeCount(record)}
                />
                <Column
                    title="管理"
                    key="action"
                    render={(_, record) => (
                        <Space size="middle">
                            {
                                record.state === 1 ? <Button danger style={{ borderColor: 'green', color: 'green' }} onClick={(e) => handleAddProductProcess(record)}>新增製程步驟</Button> :
                                    record.state === 2 ?
                                        <>
                                            <Button danger style={{ borderColor: 'green', color: 'green' }} onClick={(e) => uploadPhoto(record.orderNum)}>上傳製程照片</Button>
                                            <Button danger style={{ borderColor: 'orange', color: 'orange' }} onClick={(e) => checkOrder(record)}>廠長確認</Button>
                                        </> :

                                        <Button danger style={{ borderColor: 'green', color: 'green' }} onClick={(e) => uploadPhoto(record.orderNum)}>查看製程照片</Button>

                            }

                            {/* 只有行政和系統管理員可以編輯訂單 */}
                            {(role === 1 || role === 2) &&
                                <>
                                    <Button type="primary" ghost onClick={(e) => handleUpdate(record)}>編輯</Button>
                                    {record.state !== 5 && <Button danger onClick={(e) => showConfirm(record)}>刪除 </Button>}

                                </>

                            }
                        </Space>
                    )}
                />
            </Table>
            {openUpdatedModal && <UpdateOrderModal openModal={openUpdatedModal} handleClose={handleClose} data={selectData} />}
            {openCreatedModal && <CreateProductProcess openModal={openCreatedModal} handleClose={handleClose} data={selectData} />}
        </div>
    )
}

export default ProcessList