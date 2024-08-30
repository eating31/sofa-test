import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import { UserOutlined, TableOutlined } from '@ant-design/icons';
import { MenuUnfoldOutlined, MenuFoldOutlined, SettingOutlined, HomeOutlined, ShopOutlined, LoginOutlined } from '@ant-design/icons';
import { checkJwt } from '../../utils/jwt';

const { Sider } = Layout;

export default class index extends Component {

    state = {
        menuItems: [],
    };
    silderStyle = {
        width: 200,
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
    }
    menuItemStyle = {
        fontSize: '15px',
    }
    submenuTitleStyle = {
        color: '#fff',
    }
    getDefaultSelectedKeys = ((currentPath) => {

    })

    loggout = (() => {
        console.log(123)
        localStorage.removeItem('token')
        localStorage.removeItem('name')
        window.location.href = '/admin'
    })


    // 新增 componentDidMount 方法來檢查 localStorage 中的 token
    async componentDidMount() {
        const token = localStorage.getItem('token');
        if (token) {
            // 解析jwt token
            const data = await checkJwt(token)
            //系統管理員
            if (data.role === 1) {
                this.setState({
                    menuItems: [
                        {
                            key: '1', icon: <HomeOutlined />, label: <Link to=""><span style={this.submenuTitleStyle}>首頁選單</span></Link>

                        },
                        {
                            key: '2',
                            icon: <UserOutlined />,
                            label: <span style={this.submenuTitleStyle}>帳號管理</span>,
                            style: this.menuItemStyle,
                            children: [
                                { key: '2-1', label: <Link to="Account/List">帳號列表</Link>, },
                                { key: '2-2', label: <Link to="Account/Create">新增帳號</Link>, },
                            ],
                        },
                        {
                            key: '3',
                            icon: <TableOutlined />,
                            label: <span style={this.submenuTitleStyle}>訂單管理</span>,
                            style: this.menuItemStyle,
                            children: [
                                { key: '3-1', label: <Link to="Order/OrderList">訂單列表</Link>, },
                                { key: '3-2', label: <Link to="Order/OrderCreate">新增訂單</Link>, },
                            ],
                        },
                        {
                            key: '4',
                            icon: <SettingOutlined />,
                            label: <Link to=""><span style={this.submenuTitleStyle}>製程管理</span></Link>,
                            style: this.menuItemStyle,
                            children: [
                                { key: '4-1', label: <Link to="Process/List">開工作業</Link>, },
                                { key: '4-2', label: <Link to="Process/Manage">製程節點管理</Link>, },
                            ],
                        },
                        { key: '5', icon: <ShopOutlined />, label: <Link to="Store/Manege"><span style={this.submenuTitleStyle}>門市管理</span></Link> },
                        {
                            key: '6', icon: <LoginOutlined />, label: <span style={this.submenuTitleStyle}>登出</span>, onClick: this.loggout,
                        }
                    ]
                })

                //行政人員
            } else if (data.role === 2) {
                this.setState({
                    menuItems: [
                        {
                            key: '1', icon: <HomeOutlined />, label: <Link to="">首頁選單</Link>

                        },
                        {
                            key: '2',
                            icon: <TableOutlined />,
                            label: <span style={this.submenuTitleStyle}>訂單管理</span>,
                            style: this.menuItemStyle,
                            children: [
                                { key: '2-1', label: <Link to="Order/OrderCreate">新增訂單</Link>, },
                                { key: '2-2', label: <Link to="Order/OrderList">訂單列表</Link>, },
                            ],
                        },
                        {
                            key: '3',
                            icon: <SettingOutlined />,
                            label: <Link to="">製程管理</Link>,
                            style: this.menuItemStyle,
                            children: [
                                { key: '3-1', label: <Link to="Process/List">開工作業</Link>, },
                                { key: '3-2', label: <Link to="Process/Manage">製程節點管理</Link>, },
                            ],
                        },
                        { key: '4', icon: <HomeOutlined />, label: <Link to="Store/Manege">門市管理</Link>, style: this.menuItemStyle },
                        {
                            key: '5', icon: <LoginOutlined />, label: <span style={this.submenuTitleStyle}>登出</span>, onClick: this.loggout,
                        }
                    ]
                })
                //工廠
            } else if (data.role === 3) {
                this.setState({
                    menuItems: [
                        {
                            key: '1', icon: <HomeOutlined />, label: <Link to="">首頁選單</Link>

                        },
                        {
                            key: '2',
                            icon: <SettingOutlined />,
                            label: <Link to="">製程管理</Link>,
                            style: this.menuItemStyle,
                            children: [
                                { key: '2-1', label: <Link to="Process/List">報工作業</Link>, },
                            ],
                        },
                        {
                            key: '3', icon: <LoginOutlined />, label: <span style={this.submenuTitleStyle}>登出</span>, onClick: this.loggout,
                        }
                    ]
                })
                //門市
            } else if (data.role === 4) {
                this.setState({
                    menuItems: [
                        {
                            key: '1', icon: <HomeOutlined />, label: <Link to="">首頁選單</Link>

                        },
                        {
                            key: '2',
                            icon: <TableOutlined />,
                            label: <span style={this.submenuTitleStyle}>訂單管理</span>,
                            style: this.menuItemStyle,
                            children: [
                                { key: '2-1', label: <Link to="Order/OrderCreate">新增訂單</Link>, },
                                { key: '2-2', label: <Link to="Order/OrderList">訂單列表</Link>, },
                            ],
                        },
                        {
                            key: '6', icon: <LoginOutlined />, label: <span style={this.submenuTitleStyle}>登出</span>, onClick: this.loggout,
                        }
                    ]
                })
            }
        } else {
            // 如果沒有 token，可以進行相應的處理，例如跳轉到登入頁面
            console.log('No token found, redirecting to login...');
        }
    }

    render() {
        const { menuItems } = this.state
        const { collapsed, toggleCollapsed } = this.props
        return (
            <Sider style={this.silderStyle} collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
                <div className="logo" />
                <div style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }}>
                    {collapsed ? <MenuUnfoldOutlined onClick={toggleCollapsed} style={{ color: '#fff', fontSize: '30px' }} /> : <MenuFoldOutlined onClick={toggleCollapsed} style={{ color: '#fff', fontSize: '30px' }} />}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={this.getDefaultSelectedKeys(window.location.pathname)}
                    items={menuItems}
                ></Menu>
            </Sider>
        )
    }
}
