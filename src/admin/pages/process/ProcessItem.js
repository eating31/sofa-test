import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { Table, Breadcrumb, Space, Button, Badge, Typography, Spin, Image } from 'antd';
import '../../css/orderForm.css'; // 引入CSS
import axios from 'axios';
import { authError, checkJwt } from '../../utils/jwt';
import UploadModal from '../../components/Process/ProcessItem/UploadModal';
import UpdateModal from '../../components/Process/ProcessItem/UpdateModal';
import UpdateProcessModal from '../../components/Process/ProcessItem/UpdateProcessModal';
import DeleteModal from '../../components/Process/ProcessItem/DeleteModal';
const { Title } = Typography;
const { Column } = Table;

function ProcessItem() {
    const { orderNum } = useParams();
    const [role, setRole] = useState(0)
    const token = localStorage.getItem('token')
    const [order, setOrder] = useState(null)
    const [productRecordId, setProductRecordId] = useState()
    const [selectMethod, setSelectMethod] = useState()

    const [openUploadModal, setOpenUploadModal] = useState(false)
    const [openEditModal, setOpenEditModal] = useState(false)
    const [openEditPhotoModal, setOpenEditPhotoModal] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    function callProductProcess() {
        axios.get(`${process.env.REACT_APP_API_PATH}/api/admin/process/manage/upload/${orderNum}`, {
            headers: {
                Authorization: token
            },
        })
            .then(data => {
                console.log(data)
                setOrder(data.data.nodes)
            }).catch(err => {
                // 權限錯誤
                if (err.response?.status === 401) {
                    authError(err.response)
                } else if (err.response?.status === 403) {
                    alert(err.response?.data)
                    window.location.href = '/admin/Process/List'
                }
                console.log(err)
            })
    }
    useEffect(() => {
        callProductProcess()
        checkJwt(token).then(data => setRole(data.role))
    }, [orderNum])

    function handleClose() {
        setOpenUploadModal(false)
        setOpenEditPhotoModal(false)
        setOpenEditModal(false)
        setOpenDeleteModal(false)
        callProductProcess()
    }

    function uploadRecordPhoto(data, product) {
        console.log(data)
        // 如果是廠長品檢 先檢查其他是否已經完成
        if (data.ProcessItem.id === 1) {
            let total = 0
            let count = 0
            product.ProductRecords.map(process => {
                total++
                if (process.finish === 1) {
                    count++
                }
            })
            if (total - count !== 1) {
                alert('請先完成其他步驟')
                return
            }
        }
        setOpenUploadModal(true)
        setProductRecordId(data.id)
        setSelectMethod(data.ProcessItem)
    }

    function showImage(record) {
        if (record.ProcessItem.id === 1) {
            return (
                <video width="200" controls key={record.RecordPhotos[0]?.path}>
                    <source src={`${process.env.REACT_APP_API_PATH}/image/product/${record.RecordPhotos[0].path}`} />
                </video>
            )
        } else {
            return (
                <>{record.RecordPhotos.map((imgSrc, imgIndex) => (
                    <Image
                        key={imgIndex}
                        width={100}
                        style={{ padding: 5 }}
                        src={`${process.env.REACT_APP_API_PATH}/image/product/${imgSrc.path}`}
                    />
                ))}</>
            )
        }
    }

    // 計算完成度
    function completeCount(data) {
        let total = 0
        let count = 0
        data.Product.ProductRecords.map(process => {
            total++
            if (process.finish === 1) {
                count++
            }
        })
        return <span>{count}/{total}</span>
    }

    function editRecordPhoto(data) {
        setSelectMethod(data)
        setProductRecordId(data.id)
        setOpenEditPhotoModal(true)
    }

    function editProcess(data) {
        setSelectMethod(data)
        setOpenEditModal(true)
    }

    function deleteProcess(data) {
        setSelectMethod(data)
        console.log(data)
        setOpenDeleteModal(true)
    }

    function isAdmin(record) {
        // 如果是系統管理員或行政人員
        if (role < 3) {
            return <Space size="middle">
                <Button onClick={() => editRecordPhoto(record)} disabled={order.state > 3 ? true : false}>修改</Button>
                {/* 訂單完成後無法退回，完成之前都可以退回 */}
                <Button danger onClick={() => deleteProcess(record)} disabled={order.state === 5 ? true : false}>退回</Button>
            </Space>
        } else {
            return <Button onClick={() => editRecordPhoto(record)} disabled={order.state > 3 ? true : false}>修改</Button>
        }

    }

    const expandedRowRender = (data, index) => {
        return <Table dataSource={data.Product.ProductRecords} pagination={false} rowKey="id" scroll={{ x: 'max-content' }}>
            <Column title="製程" dataIndex="method" key="method"
                render={(text, record) => record.ProcessItem.method}
            />
            <Column title="製程步驟" dataIndex="step" key="step"
                render={(text, record) => record.ProcessItem.step}
            />
            <Column title="狀態" dataIndex="finish" key="finish"
                render={(text, record) => record.finishTime ? <Badge status="success" text="已完成" /> : <Badge status="processing" text="進行中" />}
            />
            <Column title="更新時間" dataIndex="updatedAt" key="updatedAt" align='center'
                render={(text, record) => record.finishTime ? moment(record.RecordPhotos
                [0]?.updatedAt).format('YYYY-MM-DD HH:mm:ss') : <span> - </span>}
            />
            <Column title="完成時間" dataIndex="finishTime" key="finishTime" align='center'
                render={(text, record) => record.finishTime ? moment(record.finishTime).format('YYYY-MM-DD HH:mm') : <span> - </span>}
            />
            <Column title="圖片" dataIndex="photo" key="photo" align='center'
                render={(text, record) => record.RecordPhotos.length === 0 || order.checkPhoto === 1 ? <>-</> : showImage(record)}
            />
            <Column title="管理" dataIndex="action" key="action"
                //已有圖片且為刪除 
                render={(text, record) => record.RecordPhotos.length === 0 ? <Button onClick={() => uploadRecordPhoto(record, data.Product)} disabled={order.checkPhoto === 1 ? true : false}>上傳</Button> : isAdmin(record)}
            />
        </Table>;
    };
    return (
        <div className="order-form-container" style={{ minHeight: '84vh' }}>
            <Breadcrumb
                items={[
                    { title: 'Home', href: '/admin' },
                    { title: '製程管理' },
                    { title: '開工作業', href: '/admin/Process/List' },
                    { title: '報工作業' },
                ]}
            />
            <br />
            {order &&
                <>
                    <Title level={4}>訂單編號：{order.orderNum}，客戶名稱 : {order.customer}</Title>

                    {order.note && <Title level={5}>備註：{order.note}</Title>}
                    {order.checkPhoto === 1 && <Title level={5}>註：訂單超過30天，製程圖片已刪除</Title>}
                    <Table dataSource={order.OrderItems} rowKey="id" scroll={{ x: 'max-content' }}
                        expandable={{
                            expandedRowRender,
                            defaultExpandAllRows: true
                        }}>
                        <Column title="產品名稱" dataIndex="Product" key="Product"
                            render={(text, record) => record.Product.name}
                        />
                        <Column title="產品描述" dataIndex="description" key="description"
                            render={(text, record) => record.Product.description}
                        />
                        <Column title="產品數量" dataIndex="count" key="count"
                            render={(text, record) => record.Product.count}
                        />
                        <Column title="製程數量" dataIndex="count" key="count"
                            render={(text, record) => record.Product.ProductRecords.length}
                        />
                        <Column title="完成度" dataIndex="count" key="count"
                            render={(text, record) => completeCount(record)}
                        />
                        {
                            role < 3 &&
                            <Column
                                title="管理"
                                key="action"
                                render={(_, record) => (
                                    <Space size="middle">
                                        <Button ghost type='primary' onClick={() => editProcess(record)} disabled={order.state === 5 ? true : false}>編輯製程步驟</Button>
                                    </Space>
                                )}
                            />
                        }

                    </Table>


                    {openUploadModal && <UploadModal openModal={openUploadModal} handleClose={handleClose} productRecordId={productRecordId} orderItem={selectMethod} />}
                    {openEditPhotoModal && <UpdateModal openModal={openEditPhotoModal} handleClose={handleClose} productRecordId={productRecordId} orderItem={selectMethod} />}
                    {openDeleteModal && <DeleteModal openModal={openDeleteModal} handleClose={handleClose} orderItem={selectMethod} order={order} />}
                    {openEditModal && <UpdateProcessModal openModal={openEditModal} handleClose={handleClose} orderItem={selectMethod} />}
                </>}
        </div>
    )
}

export default ProcessItem