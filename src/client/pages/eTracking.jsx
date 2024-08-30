import React, { Component } from 'react';
import { Input, Button, Row, Col, message } from 'antd';
import axios from 'axios';
import sofa from '../image/sofaIcon.png'

axios.defaults.withCredentials = true
export default class ETracking extends Component {
    state = {
        captchaSvg: '',
        captchaInput: '',
        isCaptchaVerified: false,
        formatOrder: '',
        formatPayment: '',
    }

    orderNumRef = React.createRef()
    phoneOneRef = React.createRef()

    componentDidMount() {
        this.setState({ isCaptchaVerified: false }, () => {
            this.loadCaptcha()
        })
    }
    loadCaptcha = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_PATH}/api/client/captcha`)
            this.setState({
                captchaSvg: response.data,
                formatOrder: '',
                formatPayment: '',
            })
        } catch (error) {
            console.error('Error loading captcha', error)
        }
    }
    verifyCaptcha = async () => {
        const orderNum = this.orderNumRef.current.input.value
        const phoneOne = this.phoneOneRef.current.input.value
        if (!orderNum || !phoneOne) {
            message.error('需填寫訂單編號和手機號碼')
            return
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_PATH}/api/client/verify-captcha`, { captcha: this.state.captchaInput });
            if (response.data.success) {
                this.setState({ isCaptchaVerified: true }, () => {
                    this.getOrderData(orderNum, phoneOne, this.state.isCaptchaVerified)
                })
                // message.success('Captcha OK')
                // this.props.navigate(`/client/detailTracking?orderNum=${orderNum}&phone=${phone}`)
            } else {
                this.setState({ isCaptchaVerified: false })
                message.error('驗證碼錯誤')
                this.loadCaptcha()
            }
        } catch (error) {
            console.error('Error captcha', error)
            message.error('驗證碼錯誤')
            this.loadCaptcha()
        }
    }
    getOrderData = async (orderNum, phoneOne, isCaptchaVerified) => {
        if (orderNum && phoneOne && isCaptchaVerified === true) {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_PATH}/api/client/tracking`, { orderNum, phoneOne })
                this.setState(
                    {
                        formatOrder: response.data.formatOrder,
                        formatPayment: response.data.formatPayment
                    },
                    () => {
                        const orderData = this.state.formatOrder
                        const paymentData = this.state.formatPayment
                        this.props.navigate(`/client/detailTracking`, { state: { orderData, paymentData } })
                    }
                )
            } catch (error) {
                if (error.response && (error.response.status === 400 || error.response.status === 404)) {
                    message.error(error.response.data.error)
                } else {
                    message.error('其他錯誤')
                    this.loadCaptcha()
                }
            }
        } else {
            message.error('資料欄位不完整')
            this.loadCaptcha()
        }
    }
    handleInputChange = (e) => {
        this.setState({ captchaInput: e.target.value })
    }
    handleVerifyClick = () => {
        this.verifyCaptcha()
    }

    render() {
        return (
            <div style={{ overflowX: 'hidden' }}>
                <div style={{ maxWidth: '400px', margin: '0 auto', padding: '0 10px' }}>
                    <div style={{ marginBottom: '30px', textAlign: 'left' }}>
                        <label>訂單編號</label>
                        <Input placeholder="請輸入訂單編號" ref={this.orderNumRef} />
                    </div>
                    <div style={{ marginBottom: '30px', textAlign: 'left' }}>
                        <label>手機號碼</label>
                        <Input placeholder="請輸入手機號碼" ref={this.phoneOneRef} />
                    </div>
                    <div style={{ marginBottom: '30px', textAlign: 'left' }}>
                        <label>驗證碼</label>
                        <Row gutter={8}>
                            <Col span={12}>
                                <Input
                                    placeholder="請輸入驗證碼"
                                    value={this.state.captchaInput}
                                    onChange={this.handleInputChange}
                                    style={{ width: '100%' }}
                                />
                            </Col>
                            <Col span={12}>
                                {/* 驗證碼圖片 */}
                                <div style={{ width: '100%', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: this.state.captchaSvg }} />
                            </Col>
                        </Row>
                    </div>
                    <Button
                        type="primary"
                        style={{ width: '100%', backgroundColor: '#4EBEC6', borderColor: '#4EBEC6' }}
                        onClick={this.handleVerifyClick}
                    >
                        查詢
                    </Button>
                </div>
                {/* 對齊至中 */}
                <div style={{ marginTop: '20px', position: 'relative', textAlign: 'center' }}>
                    <img
                        src={sofa}
                        alt="Sofa Icon"
                        style={{ width: '300px', height: '300px', maxWidth: '100%' }}
                    />
                </div>
            </div>
        )
    }
}
