import React, { Component } from 'react';
import { Carousel, Typography } from 'antd';
import '../css/detailTracking.css';
import Banner from '../image/Banner1.png'
import logo from '../image/logo.png'
import TrunkIcon from '../image/trunkIcon.png'
const { Title } = Typography;

export default class Header extends Component {
    contentStyle = {
        margin: 0,
        height: '160px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
        objectFit: 'cover'
    }

    render() {
        return (
            <div>
                <Carousel autoplay>
                    <div>
                        <img
                            src={Banner}
                            alt="Banner 1"
                            // style={this.contentStyle}
                            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                        />
                    </div>
                </Carousel>
                <div className="header-content">
                    <img
                        src={logo}
                        alt="訂單追蹤系統"
                        className="header-logo"
                    />
                    <Title level={2} className="header-title">訂單追蹤系統</Title>
                </div>
                <div className="header-divider">
                    <img
                        src={TrunkIcon}
                        alt="Truck Icon"
                        className="header-icon"
                    />
                </div>
            </div>
        )
    }
}
