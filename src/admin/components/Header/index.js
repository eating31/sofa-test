import React, { Component } from 'react'
import {Layout} from 'antd'

const {Header} = Layout;

export default class ComponentHeader extends Component {
  headerStyle = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    fontSize: '20px', 
    //fontFamily: '微软正黑体, Microsoft JhengHei, 微软雅黑, Arial, sans-serif', 
    width: '100%', //整個頁面的100%的寬度
    //backgroundColor: '#4096ff',
  }

  render() {
    return (
      <Header style={this.headerStyle}>訂單追蹤系統後台</Header>
    )
  }
}
