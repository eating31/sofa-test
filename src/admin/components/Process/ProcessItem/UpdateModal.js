import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Image, Upload, Modal, DatePicker, Row, Col, Button, Flex } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const UpdateModal = ({ openModal, handleClose, productRecordId, orderItem }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([])
    const [images, setImages] = useState([]);
    const [video, setVideo] = useState()
    const [originPhotoId, setOriginPhotoId] = useState([])
    const [finishTime, setFinishTime] = useState(null)


    useEffect(() => {
        console.log(orderItem)
        if (openModal && orderItem) {
            setFinishTime(dayjs(orderItem.finishTime).local())
            // 將目前圖片加入預覽
            const temp = []
            const ids = []
            orderItem?.RecordPhotos.map(each => {
                ids.push(each.id)
                temp.push({
                    uid: each.id,
                    name: each.path,
                    status: 'done',
                    url: `${process.env.REACT_APP_API_PATH}/image/product/${each.path}`
                })
            })
            setFileList(temp)
            setOriginPhotoId(ids)
        }
    }, [orderItem])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (finishTime && (video || images)) {
            const formData = new FormData();
            formData.append('productRecordId', productRecordId);
            formData.append('finishTime', finishTime);

            // 如果是廠長品檢，就上傳影片
            if (orderItem.ProcessItem.id === 1) {
                formData.append('video', video.originFileObj);
                formData.append('id', orderItem.RecordPhotos[0].id);

                axios.put(`${process.env.REACT_APP_API_PATH}/api/admin/process/manage/video/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': localStorage.getItem('token')
                    }
                }).then(data => {
                    alert('影片更新成功')
                    handleClose()
                }).catch(err => {
                    alert('影片更新失敗')
                    console.log(err)
                })
            } else {
                // 列出被刪除的圖片id 
                const newId = fileList.map(item => item.uid)
                const deleteId = originPhotoId.filter(item => !newId.includes(item));
                formData.append('deleteId', deleteId)

                // 列出新增的圖片 File
                images.forEach((image, index) => {
                    // 如果不為undefined 代表是新增的圖片
                    if (images) {
                        formData.append('image', image);
                    }
                });

                axios.put(`${process.env.REACT_APP_API_PATH}/api/admin/process/manage/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': localStorage.getItem('token')
                    }
                }).then(data => {
                    alert('更新上傳成功')
                    setFinishTime()
                    handleClose()
                }).catch(err => {
                    alert('圖片更新失敗')
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
        console.log(newFileList)

        const file = newFileList[0];
        console.log(newFileList[0])
        setVideo(file);
    };
    return (
        <Modal
            title={`更新製程流程圖片 - ${orderItem?.ProcessItem?.method}`}
            centered
            open={openModal}
            onOk={handleSubmit}
            okText='更新'
            cancelText='取消'
            onCancel={handleClose}

        >
            <div style={{ padding: 20 }}>
                <Row gutter={24}>
                    <Col>完成日期</Col>
                    <Col>
                        <DatePicker
                            key={finishTime ? finishTime : 'empty'}
                            placeholder="請選擇製程完成時間"
                            style={{ width: '100%' }}
                            format={'YYYY-MM-DD HH:mm'}
                            showTime
                            defaultValue={finishTime ? dayjs(finishTime, 'YYYY-MM-DD HH:mm') : null}
                            onChange={(e) => setFinishTime(e ? e : null)}
                        />
                    </Col>
                </Row>
                <br />
                {fileList.length > 0 && orderItem.ProcessItem.id === 1 ?
                    <Flex align='center' style={{
                        width: '100%',
                    }}>
                        <p style={{ paddingRight: '20px' }}>重新上傳</p>
                        <Upload
                            onChange={handleVideoChange}
                            listType="picture"
                            accept='video/*'
                            beforeUpload={true}
                            maxCount={1}
                            style={{
                                width: '100%',
                            }}
                            className="upload-list-inline"
                        >
                            {video ? null : <Button icon={<UploadOutlined />}>上傳影片</Button>}
                        </Upload>
                    </Flex>
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

export default UpdateModal;
