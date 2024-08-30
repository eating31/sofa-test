import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload, Modal, DatePicker, Row, Col, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const UploadModal = ({ openModal, handleClose, productRecordId, orderItem }) => {

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([])
    const [images, setImages] = useState([]);
    const [video, setVideo] = useState()
    const [finishTime, setFinishTime] = useState(null)

    useEffect(() => {
        if (openModal) {
            setFinishTime(null);
            setFileList([]);
            setImages([]);
            setVideo(null);
        }
    }, [openModal])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (finishTime && (video || images.length > 0)) {
            const formData = new FormData();
            formData.append('productRecordId', productRecordId);
            formData.append('finishTime', finishTime);

            // 如果是廠長品檢，就上傳影片
            if (orderItem.id === 1) {
                console.log(video)
                formData.append('video', video.originFileObj);
                axios.post(`${process.env.REACT_APP_API_PATH}/api/admin/process/manage/video/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': localStorage.getItem('token')
                    }
                }).then(data => {
                    alert('影片上傳成功')
                    handleClose()
                }).catch(err => {
                    alert('影片上傳失敗')
                    console.log(err)
                })
            } else {
                images.forEach((image, index) => {
                    console.log(image)
                    formData.append('image', image);
                });

                axios.post(`${process.env.REACT_APP_API_PATH}/api/admin/process/manage/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': localStorage.getItem('token')
                    }
                }).then(data => {
                    alert('圖片上傳成功')
                    handleClose()
                }).catch(err => {
                    alert('圖片上傳失敗')
                    console.log(err)
                })
            }
        } else {
            alert('請選擇完成日期或上傳至少一張圖片')
        }
    };

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };
    const handleChange = ({ fileList: newFileList }) => {
        console.log(newFileList)
        if (newFileList.length > 5) {
            alert('最多只能上傳五張圖片，請重新選擇！')
            return
        } else {
            const fileList = newFileList.map(each => { return each.originFileObj })
            console.log(fileList)
            //後端儲存
            setImages(fileList)
            // 前端顯示
            setFileList(newFileList)
        }

    };
    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );

    const handleVideoChange = ({ fileList: newFileList }) => {
        const file = newFileList[0];
        setVideo(file);
    };

    useEffect(() => {
        console.log(finishTime)
    }, [finishTime])
    return (
        <Modal
            title={`上傳製程流程圖片 - ${orderItem?.method}`}
            centered
            open={openModal}
            onOk={handleSubmit}
            okText='存檔'
            cancelText='取消'
            onCancel={handleClose}

        >
            <div style={{ padding: 20 }}>
                <Row gutter={24}>
                    <Col>完成日期</Col>
                    <Col>
                        <DatePicker showTime placeholder="請選擇製程完成時間"
                            key={finishTime ? finishTime : 'empty'}
                            style={{ width: '100%' }}
                            format={'YYYY-MM-DD HH:mm'}
                            defaultValue={finishTime ? dayjs(finishTime, 'YYYY-MM-DD HH:mm') : null}
                            onChange={(e) => setFinishTime(e ? e.format('YYYY-MM-DD HH:mm') : null)} />
                    </Col>
                </Row>
                <br />
                {orderItem && orderItem.id === 1 ?
                    <Upload
                        onChange={handleVideoChange}
                        listType="picture"
                        accept='video/*'
                        beforeUpload={true}
                        maxCount={1}
                    >
                        {video ? null : <Button icon={<UploadOutlined />}>上傳影片</Button>}
                    </Upload>
                    :
                    <>
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            multiple={true}
                            accept='image/*'
                            beforeUpload={true}
                            onPreview={handlePreview}
                            onChange={handleChange}
                        >
                            {fileList.length >= 5 ? null : uploadButton}
                        </Upload>
                        {previewImage && (
                            <Image
                                wrapperStyle={{
                                    display: 'none',
                                }}
                                preview={{
                                    visible: previewOpen,
                                    onVisibleChange: (visible) => setPreviewOpen(visible),
                                    afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                }}
                                src={previewImage}
                            />
                        )}
                    </>
                }

            </div>

        </Modal>

    );
};

export default UploadModal;
