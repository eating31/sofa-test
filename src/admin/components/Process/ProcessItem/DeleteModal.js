import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Image, Upload, Modal, Flex, Row, Col, Button } from 'antd';
import { ExclamationCircleTwoTone, PlusOutlined } from '@ant-design/icons';

function DeleteModal({ openModal, handleClose, orderItem, order }) {
    useEffect(() => {
        console.log(orderItem)
        console.log(order)
    }, [orderItem, order])

    function handleSubmit() {
        axios.delete(`${process.env.REACT_APP_API_PATH}/api/admin/process/manage/upload`, {
            headers: {
                Authorization: localStorage.getItem('token')
            },
            data: {
                orderNum: order.orderNum,
                state: order.state,
                productId: orderItem.productId,
                id: orderItem.id
            }
        })
            .then(data => {
                alert('退回成功！')
                handleClose()
            }).catch(err => {
                alert(err.response.data)
                console.log(err)
            })
    }
    return (
        <Modal
            title={`退回製程流程 - ${orderItem?.ProcessItem?.method}`}
            centered
            open={openModal}
            onOk={handleSubmit}
            okText='確定退回'
            cancelText='取消'
            onCancel={handleClose}

        >
            <Flex>
                <ExclamationCircleTwoTone style={{ padding: '10px' }} /><p>確定要將已完成的流程退回嗎？</p>
            </Flex>
            <Flex>
                <ExclamationCircleTwoTone style={{ padding: '10px' }} /> <p>已上傳的圖片將會被刪除並且狀態改回進行中</p>
            </Flex>


        </Modal>
    )
}

export default DeleteModal