import React, { Component } from 'react';
import { Modal,Button,message,Typography,Table,Space,Badge} from 'antd';
import { OrderedListOutlined } from '@ant-design/icons';
import ShipmentCreate from './shipmentCreate';
import dayjs from 'dayjs';
import axios from 'axios';


export default class ShipmentList extends Component {
    state={
        openCreateDialog:false,
        shipmentList:[]
    }
    token = localStorage.getItem('token')
    componentDidUpdate(prevProps){
        if (this.props.open && !prevProps.open) {
            this.getPageData()
        }
    }
    handleAddShipment=()=>{
        this.setState({openCreateDialog:true})
    }
    closeCreateShipment=()=>{
        this.setState({openCreateDialog:false})
    }
    handelCreateShipment=(values)=>{
        this.props.onCreate(values)
        this.closeCreateShipment()
    }
    handleCancelShipment=async (shipmentData)=>{
        try{
            const response =await axios.put(`${process.env.REACT_APP_API_PATH}/api/admin/shipment/cancelShipment`,shipmentData, {
                headers: {
                    Authorization: this.token
                },
            })
            if (response.data  && response.status===200)
            {
                message.success('出貨單取消成功')
                this.getPageData()
                this.props.onShipmentUpdate()
            }
            else{
                message.error('出貨單取消失敗')
            }
        }
        catch(error){
            if (error.response && error.response.status === 400) {
                console.error('error.response.data.error:', error.response.data.error);
                message.error(error.response.data.error);
            } else {
                console.error('Error:', error)
                message.error('出貨單取消其他錯誤',error)
            }
        }
    }
    handleCloseOrder=async(shipmentData)=>{
        try{
            const response =await axios.put(`${process.env.REACT_APP_API_PATH}/api/admin/shipment/closeOrder`,shipmentData, {
                headers: {
                    Authorization: this.token
                },
            })
            if (response.data  && response.status===200)
            {
                message.success('訂單結單成功')
                this.getPageData()
                this.props.onShipmentUpdate()
            }
            else{
                message.error('訂單結單失敗')
            }
        }
        catch(error){
            if (error.response && error.response.status === 400) {
                console.error('error.response.data.error:', error.response.data.error);
                message.error(error.response.data.error);
            } else {
                console.error('Error:', error)
                message.error('訂單結單其他錯誤',error)
            }
        }
    }
    getPageData=async ()=>{
        try{
            const response =await axios.get(`${process.env.REACT_APP_API_PATH}/api/admin/shipment/${this.props.choseOrder}`, {
                headers: {
                    Authorization: this.token
                },
            })
            if (response.data  && response.status===200)
            {
                this.setState({shipmentList:response.data})
            }
            else{
                message.error('出貨單列表失敗')
            }
        }
        catch(error){
            if (error.response && error.response.status === 400) {
                console.error('error.response.data.error:', error.response.data.error);
                message.error(error.response.data.error);
            } else {
                console.error('Error:', error)
                message.error('出貨單其他錯誤',error)
            }
        }
    }
    columns = [
        {
            title: '確認出貨日期',
            dataIndex: 'shipmentDate',
            key: 'shipmentDate',
            width: 150,
            render: (text) => dayjs.utc(text).format('YYYY-MM-DD HH:mm'),
        },
        {
            title: '出貨狀態',
            dataIndex: 'publish',
            key: 'publish',
            width: 100,
            render: (text, record) => {
                if (text === 1 && record.finish === 0) {
                    return <Badge status="processing" text="出貨安排" />
                } else if (text === 1 && record.finish === 1) {
                    return <Badge status="success" text="已完成" />
                } else {
                    return <Badge status="default" text="取消" />
                }
            },
        },
        {
            title: '出貨備註',
            dataIndex: 'note',
            key: 'note',
            width: 200,
            render: (text) => {
                return ( <div style={{ whiteSpace: 'pre-wrap' }}>{text ? text : ''}</div>)
            },
        },
        {
            title: '建單者',
            dataIndex: 'triggerBy',
            key: 'triggerBy',
            width: 100,
        },
        {
            title: '更新人',
            dataIndex: 'updatedBy',
            key: 'updatedBy',
            width: 100,
        },
        {
            title: '管理',
            key: 'action',
            width: 200,
            render: (_, record) =>{
                return (
                    record.publish === 1 &&record.finish===0? (
                        <Space size="middle">
                            <Button type="primary" 
                                onClick={()=>{this.handleCloseOrder({shipmentId:record.id,orderId:record.orderId})}} 
                                style={{ borderColor: 'green', color: 'green' }} ghost >確認收貨結單
                            </Button>
                            <Button 
                                danger 
                                onClick={()=>{this.handleCancelShipment({shipmentId:record.id,orderId:record.orderId})}}
                            >退單取消</Button>
                        </Space>
                    ) : null
                )
            }
        },
    ]
    
    render() {
        const { open,onCancel ,choseOrder} = this.props
        //如果所有出貨單已完成關閉下方按鈕
        const shipmentFinish=this.state.shipmentList.find((Obj)=>{
            return Obj.finish===1
        })

        return (
            <Modal
                open={open}
                title={
                    <Typography.Title level={4} style={{ margin: 0 }}>
                        <OrderedListOutlined style={{ marginRight: 8 }} />
                        {`${choseOrder} 出貨紀錄`}
                    </Typography.Title>
                }
                cancelText="關閉"
                okText="新增出貨單"
                onCancel={onCancel}
                onOk={this.handleAddShipment}
                width={900}  
                style={{ maxHeight: '60vh', overflowY: 'auto' }}
                footer={shipmentFinish ? null : undefined} // 如果所有出貨單已完成關閉下方按鈕
            >
                    <Table
                        columns={this.columns}
                        dataSource={this.state.shipmentList}
                        rowKey="id"
                        pagination={false}
                        scroll={{ x: 800,y:300 }}
                    />
                <ShipmentCreate
                    open={this.state.openCreateDialog}
                    choseOrder={choseOrder}
                    onCancel={this.closeCreateShipment}
                    onCreate={this.handelCreateShipment}
                />
            </Modal>
        )
    }
}

