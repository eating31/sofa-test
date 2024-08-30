import React, { useState, useEffect } from 'react'
import axios from 'axios';

import { Select, Space, Modal, Form } from 'antd';

function CreateProductProcess({ openModal, handleClose, data }) {
    const [allNodes, setAllNodes] = useState([])
    const [form] = Form.useForm();
    const [selectedValues, setSelectedValues] = useState({});

    const token = localStorage.getItem('token')


    useEffect(() => {
        console.log(data)
        if (openModal && data) {
            //新建產品變數，預設1為廠長品檢，待存製程流程
            const newObject = data.OrderItems.reduce((acc, item) => {
                acc[item.productId] = [1];
                return acc;
            }, {});
            setSelectedValues(newObject)

            // 取得製程流程
            axios.get(`${process.env.REACT_APP_API_PATH}/api/admin/process/manage/nodes`, {
                headers: {
                    Authorization: token
                },
            })
                .then(data => {
                    console.log(data.data)
                    const newData = data.data.nodes.map(each => {
                        return {
                            label: `${each.method} - ${each.step}`,
                            title: each.method,
                            value: each.id
                        }
                    })
                    setAllNodes(newData)
                }).catch(err => {
                    alert(err.response.data)
                    console.log(err)
                })

        }
    }, [openModal, data]);

    function createNode() {
        axios.post(`${process.env.REACT_APP_API_PATH}/api/admin/process/manage`, { data: selectedValues, orderId: data.orderNum }, {
            headers: {
                Authorization: token
            },
        })
            .then(data => {
                console.log(data)
                alert('新增製程步驟成功')
                handleClose()

            }).catch(err => {
                alert(err.response.data)
                console.log(err)
            })

    }

    const labelRender = (props) => {
        const { label, value, title } = props;
        if (label) {
            return title;
        }
        return <span>当前 value 没有对应的选项</span>;
    };

    const handleChange = (value, productId) => {
        console.log(value, productId)
        setSelectedValues(prev => ({
            ...prev,
            [productId]: value,
        }));
    };

    useEffect(() => {
        console.log(selectedValues)
    }, [selectedValues])

    return (
        <Modal
            title="建立新製程步驟"
            centered
            open={openModal}
            onOk={createNode}
            okText='確定開工'
            cancelText='取消'
            onCancel={handleClose}
        >
            <Form
                form={form}
                name="basic"
                labelCol={{
                    span: 6,
                }}
                wrapperCol={{
                    span: 18,
                }}
                style={{
                    maxWidth: 600,
                }}>
                {data && data.OrderItems.map(each => {
                    return (
                        <Form.Item
                            key={`product_${each.productId}`}
                            label={each.Product.name}
                            name={`product_${each.productId}`}
                            rules={[
                                {
                                    required: true,
                                    message: '請選擇製程步驟！',
                                },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                labelRender={labelRender}
                                placeholder="請選擇製程步驟"
                                defaultValue={1}
                                value={selectedValues[each.productId]}
                                onChange={value => handleChange(value, each.productId)}
                                style={{
                                    width: '100%',
                                }}
                                options={allNodes}
                            />
                        </Form.Item>
                    )
                })}
            </Form>

        </Modal>
    )
}

export default CreateProductProcess