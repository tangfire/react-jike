import {
    Breadcrumb,
    Button,
    Card,
    Col,
    Form, type GetProp,
    Input,
    message,
    Radio,
    type RadioChangeEvent,
    Row,
    Select,
    Space,
    Upload, type UploadProps
} from "antd";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import './index.scss'

import {useChannel} from "../../hooks/useChannel.tsx";
import { useState} from "react";
import {createArticleAPI} from '@/apis/articles.jsx'

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};


const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};
const Publish = () => {
    // 获取频道列表
    const {channelList} = useChannel();

    const [form] = Form.useForm();

    const onGenderChange = (value: string) => {
        switch (value) {
            case 'male':
                form.setFieldsValue({ note: 'Hi, man!' });
                break;
            case 'female':
                form.setFieldsValue({ note: 'Hi, lady!' });
                break;
            case 'other':
                form.setFieldsValue({ note: 'Hi there!' });
                break;
            default:
        }
    };

    // 提交表单
    const onFinish = (values: any) => {
        if (imageList.length !== imgValue) {
            return message.warning('封面类型和图片数量不匹配')
        }
        console.log(values);
        // 1. 按照接口文档的格式处理收集到的表单数据
        const {title,content,channel_id} = values;
        const reqData = {
            title,
            content,
            cover:{
                type:imgValue,
                images:imageList.map(item =>item.response.data.url) // 图片列表
            },
            channel_id,

        }
        // 2. 调用接口提交
        createArticleAPI(reqData)
    };

    const [value, setValue] = useState('');

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'link', 'image'
    ];

    const [imgValue, setImgValue] = useState(0);

    // 切换图片封面类型
    const onImageChange = (e: RadioChangeEvent) => {
        setImgValue(e.target.value);
    };

    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };


    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    const [imageList, setImageList] = useState([])

    const handleFileChange: UploadProps['onChange'] = (value) => {
        console.log('正在上传中',value);
        setImageList(value.fileList)
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    return (
        <div>

            <Row justify="center">
                <Col xs={24} sm={22} md={20} lg={18} xl={16}>
                    <Card title={
                        <Breadcrumb
                            items={[
                                {
                                    title: '创建文章',
                                },

                            ]}
                        />
                    }  style={{ width: '100%',minHeight:'500px' }}>
                        <Form
                            {...layout}
                            form={form}
                            name="control-hooks"
                            onFinish={onFinish}
                            style={{ maxWidth: 600 }}
                        >
                            <Form.Item name="title" label="标题" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="channel_id" label="频道" rules={[{ required: true }]}>
                                <Select
                                    allowClear
                                    placeholder="Select a option and change input text above"
                                    onChange={onGenderChange}
                                    options={channelList.map(channel => (
                                        {
                                            label: channel.name,
                                            value: channel.id,
                                        }
                                    ))}
                                />
                            </Form.Item>

                            <Form.Item name="type" label="封面">
                                <Radio.Group
                                    onChange={onImageChange}
                                    value={imgValue}
                                    options={[
                                        {
                                            value: 0,
                                            label: "无图",
                                        },
                                        {
                                            value: 1,
                                            label: "单图",
                                        },
                                        {
                                            value: 3,
                                            label: "三图",
                                        },
                                    ]}
                                />

                                <div style={{height:20}}></div>

                                {imgValue >0  && <Upload
                                    name="image"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={true}
                                    action="http://127.0.0.1:8001/v1/upload"
                                    beforeUpload={beforeUpload}
                                    onChange={handleFileChange}
                                    maxCount={imgValue}
                                >
                                    {imageUrl ? (
                                        <img draggable={false} src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                                    ) : (
                                        uploadButton
                                    )}
                                </Upload>}
                            </Form.Item>

                            <Form.Item label="内容" name="content" rules={[{ required: true ,message:'请输入文章内容'}]}>
                                <ReactQuill
                                    className="custom-quill"
                                    theme="snow"
                                    value={value}
                                    onChange={setValue}
                                    modules={modules}
                                    formats={formats}
                                />
                            </Form.Item>

                            <Form.Item {...tailLayout}>
                                <Space>
                                    <Button type="primary" htmlType="submit">
                                        发布文章
                                    </Button>

                                </Space>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>



        </div>
    )
}

export default Publish