import React, { Component } from 'react';
import { Modal, List,Button,message,Row,Col,Typography} from 'antd';
import { DeleteOutlined,OrderedListOutlined ,ExclamationCircleFilled} from '@ant-design/icons';
import PaymentCreate from './paymentCreate';
import dayjs from 'dayjs';
import axios from 'axios';

const { confirm } = Modal;

export default class PaymentList extends Component {
    state={
        openCreateDialog:false,
        paymentList:[],
        orderLsit:[]
    }
    token = localStorage.getItem('token')
    componentDidUpdate(prevProps){
        if (this.props.open && !prevProps.open) {
            this.getPageData()
        }
    }
    getPageData=async ()=>{
        try{
            const response =await axios.get(`${process.env.REACT_APP_API_PATH}/api/admin/payment/${this.props.choseOrder}`, {
                headers: {
                    Authorization: this.token
                },
            })
            if (response.data  && response.status===200){
                const {existingPayment,existingOrder}=response.data
                this.setState(
                    {
                        paymentList:existingPayment,
                        orderLsit:existingOrder
                    },
                )
            }
            else{
                message.error('訂單列表失敗')
            }
        }
        catch(error){
            if (error.response && error.response.status === 400) {
                console.error('error.response.data.error:', error.response.data.error);
                message.error(error.response.data.error);
            } else {
                console.error('Error:', error)
                message.error('其他錯誤',error)
            }
        }
    }
    handleDeletePay=async(id)=>{
        confirm({
            title: '請問確定要取消此筆付款紀錄嗎？',
            icon: <ExclamationCircleFilled />,
            okText: '確定',  
            cancelText: '取消',  
            onOk: async () => {
                try{
                    const response = await axios.put(`${process.env.REACT_APP_API_PATH}/api/admin/payment/${id}`,{}, {
                        headers: {
                            Authorization: this.token
                        },
                    })
                    console.log('response',response.status,response.data )
                    if (response.data  && response.status===200){
                        message.success('付款取消成功')
                        this.getPageData()
                        this.props.onPaymentUpdate()
                    }
                    else{
                        message.error('付款取消失敗')
                    }
                }
                catch(error){
                    if (error.response && error.response.status === 400) {
                        console.error('error.response.data.error:', error.response.data.error);
                        message.error(error.response.data.error);
                    } else {
                        console.error('Error:', error)
                        message.error('付款紀錄刪除其他錯誤',error)
                    }
                }
            },
            onCancel: () => {
                this.handleCloseAdd()
            },
        });
    }
    handleAddPayment=()=>{
        this.setState({openCreateDialog:true})
    }
    handleCloseAdd=()=>{
        this.setState({openCreateDialog:false})
    }
    handleCreatePayment = (values) => {
        this.props.onCreate(values)
        this.handleCloseAdd() // 新增成功後關閉對話框
    }
    render() {
        const { open,onCancel ,choseOrder} = this.props
        return (
            <Modal
                open={open}
                title={
                    <Typography.Title level={4} style={{ margin: 0 }}>
                        <OrderedListOutlined style={{ marginRight: 8 }} />
                        {`${choseOrder} 付款紀錄`}
                    </Typography.Title>
                }
                cancelText="關閉"
                okText="新增付款單"
                onCancel={onCancel}
                onOk={this.handleAddPayment}
                footer={this.state.orderLsit.finish === 0 ? undefined : null}
                
            >
                <Row justify="center" align="middle">
                    <Col xs={24} sm={22} md={20} lg={18} xl={16}>
                        <List
                            itemLayout="horizontal"
                            dataSource={this.state.paymentList}
                            renderItem={(item, index) => (
                                <List.Item actions={
                                    this.state.orderLsit.finish===0?
                                        (item.publish ===1?
                                            [<Button icon={<DeleteOutlined/>} onClick={()=>{this.handleDeletePay(item.id)}}/>]
                                        :null):null
                                }>
                                <List.Item.Meta
                                    title={
                                        <span style={item.publish === 0 ? { textDecoration: 'line-through' } : {}}>
                                            {dayjs(item.paidDate).format('YYYY-MM-DD')}&nbsp;&nbsp;
                                            NT${item.price.toLocaleString()}&nbsp;
                                            ({item.type === 1 ? '匯款' : item.type === 2 ? '信用卡' : '其他'})
                                        </span>}
                                    description={`${item.note===null?'':item.note}  `}/>
                                </List.Item>
                            )}
                        />
                        <PaymentCreate
                            open={this.state.openCreateDialog}
                            onCancel={this.handleCloseAdd}
                            onCreate={this.handleCreatePayment}
                            choseOrder={choseOrder} />
                    </Col>
                </Row>
            </Modal>
        )
    }
}

