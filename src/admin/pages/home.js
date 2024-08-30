import React, { useState, useEffect } from 'react';
import { Card, Flex, Row, Col } from 'antd';
import { checkJwt } from '../utils/jwt';
import { UnorderedListOutlined, UserAddOutlined, FileAddOutlined, AppstoreAddOutlined, ShopOutlined, ToolOutlined } from '@ant-design/icons';
const Home = () => {
    const [list, setList] = useState([])
    useEffect(() => {

        const token = localStorage.getItem('token');
        if (token) {
            // 解析jwt token
            checkJwt(token).then(data => {
                if (data.role === 1) {
                    setList([
                        { name: '帳號管理', subList: [{ name: '帳號列表', url: '/admin/Account/List', icon: <UnorderedListOutlined /> }, { name: '新增帳號', url: '/admin/Account/Create', icon: <UserAddOutlined /> }] },
                        { name: '訂單管理', subList: [{ name: '訂單列表', url: '/admin/Order/OrderList', icon: <UnorderedListOutlined /> }, { name: '新增訂單', url: '/admin/Order/OrderCreate', icon: <FileAddOutlined /> }] },
                        { name: '製程管理', subList: [{ name: '報工作業', url: '/admin/Process/List', icon: <ToolOutlined /> }, { name: '製程節點管理', url: '/admin/Process/Manage', icon: <AppstoreAddOutlined /> }] },
                        { name: '門市管理', subList: [{ name: '門市管理', url: '/admin/Store/Manege', icon: <ShopOutlined /> }] },
                    ])
                } else if (data.role === 2) {
                    setList([
                        { name: '訂單管理', subList: [{ name: '訂單列表', url: '/admin/Order/OrderList', icon: <UnorderedListOutlined /> }, { name: '新增訂單', url: '/admin/Order/OrderCreate', icon: <FileAddOutlined /> }] },
                        { name: '製程管理', subList: [{ name: '報工作業', url: '/admin/Process/List', icon: <ToolOutlined /> }, { name: '製程節點管理', url: '/admin/Process/Manage', icon: <AppstoreAddOutlined /> }] },
                        { name: '門市管理', subList: [{ name: '門市管理', url: '/admin/Store/Manege', icon: <ShopOutlined /> }] },
                    ])
                } else if (data.role === 3) {
                    setList([
                        { name: '製程管理', subList: [{ name: '報工作業', url: '/admin/Process/List', icon: <ToolOutlined /> }] },
                    ])
                } else if (data.role === 4) {
                    setList([
                        { name: '訂單管理', subList: [{ name: '訂單列表', url: '/admin/Order/OrderList', icon: <UnorderedListOutlined /> }, { name: '新增訂單', url: '/admin/Order/OrderCreate', icon: <FileAddOutlined /> }] },
                    ])
                } else {
                    // 莫名其妙的權限
                    console.log('no groupId')
                }
            })
        }
    }, []);

    return (
        <Flex align="center" style={{ minHeight: '81vh', backgroundColor: 'white', paddingBlock: '20px 20px', paddingLeft: '15px', alignItems: 'center' }} >
            <Row gutter={[24, 36]} style={{ width: '100%' }} justify="center">
                {list.length > 0 && list.map(each => {
                    return (
                        <Col xs={24} md={{ offset: 1, span: 8 }} key={each.name} >
                            <Card type="inner" title={each.name} style={{ minHeight: '180px', border: 'thick double #BFBFBF' }} key={each.name} >
                                {each?.subList?.length > 0 && each.subList.map(sub => {
                                    return (
                                        <p key={sub.name}>
                                            <a href={sub.url}>
                                                {sub.icon}  {sub.name}
                                            </a>
                                        </p>

                                    )
                                })}
                            </Card>
                        </Col>
                    )
                })}
            </Row>
        </Flex>

    );
};
export default Home;