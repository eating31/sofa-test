import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Select, Spin, Modal, Space, Button, Flex } from 'antd';
const { confirm } = Modal;

function UpdateProcessModal({ openModal, handleClose, orderItem }) {
    const [allNodes, setAllNodes] = useState([])
    const [selectedValues, setSelectedValues] = useState([]);
    const [open, setOpen] = useState(false);
    const token = localStorage.getItem('token')

    function handleSubmit() {
        // 確認廠長品檢有被選到
        if (selectedValues.includes(1)) {
            axios.put(`${process.env.REACT_APP_API_PATH}/api/admin/process/manage`, { productId: orderItem.productId, processArray: selectedValues }, {
                headers: {
                    Authorization: token
                },
            })
                .then(data => {
                    console.log(data.data)
                    alert('製程步驟更新成功！')
                    handleClose()
                }).catch(err => {
                    alert(err.response.data)
                    console.log(err)
                })
        } else {
            alert('廠長品檢為必須步驟，請重新選擇')
            setOpen(false)
        }


    }

    useEffect(() => {
        console.log(orderItem)
        if (openModal && orderItem) {
            // 加入原本的製程步驟
            const ids = orderItem.Product.ProductRecords.map(each => each.ProcessItem.id);
            setSelectedValues(ids)

            // 取得所有製程流程
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
    }, [openModal, orderItem])

    const labelRender = (props) => {
        const { label, value, title } = props;
        if (label) {
            return title;
        }
        return <span>当前 value 没有对应的选项</span>;
    };

    const handleChange = (value) => {
        console.log(value)
        setSelectedValues(value)
    };

    const showConfirm = () => {
        confirm({
            title: '請問確定要更新製程步驟嗎？',
            icon: <ExclamationCircleFilled />,
            content: '若刪除已完成的製程步驟，將無法復原',
            onOk() {
                handleSubmit()
            },
            onCancel() {
                setOpen(false)
                handleClose()
            },
        });
    };

    return (
        <Modal
            title='更新製程步驟'
            centered
            open={openModal}
            footer={null}
            onCancel={handleClose}
        >
            <div style={{ padding: 20 }}>
                {selectedValues.length > 0 ?
                    <>
                        <p>產品名稱：{orderItem.Product.name}</p>
                        <p>製程步驟：</p>
                        <Select
                            mode="multiple"
                            labelRender={labelRender}
                            placeholder="請選擇製程步驟"
                            defaultValue={selectedValues}
                            onChange={value => handleChange(value)}
                            style={{
                                width: '100%',
                            }}
                            options={allNodes}
                        />
                        <Flex justify='flex-end' style={{ paddingTop: '30px' }}>
                            <Space size='large'>
                                <Button onClick={handleClose}>
                                    取消
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={showConfirm}
                                >
                                    更新
                                </Button>
                            </Space>
                        </Flex>
                    </>
                    :
                    <Spin size="large" />
                }
            </div>
        </Modal>
    )
}

export default UpdateProcessModal