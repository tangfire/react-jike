import {
    Breadcrumb,
    Button,
    Card,
    Col,
    Form, type GetProp,
    Input, message,
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

// 定义类型
interface ArticleFormData {
    title: string;
    content: string;
    channel_id: number;
    type: number;
}

interface CreateArticleRequest {
    title: string;
    content: string;
    cover: {
        type: number;
        images: string[];
    };
    channel_id: number;
}

interface UploadFile {
    uid: string;
    status: 'uploading' | 'done' | 'error' | 'removed';
    response?: {
        data: {
            url: string;
        };
    };
    url?: string;
}

const Publish = () => {
    // 获取频道列表
    const {channelList} = useChannel();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    // 添加状态来跟踪当前选择的封面类型
    const [currentCoverType, setCurrentCoverType] = useState(0);

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

    // 处理封面类型变化
    const onCoverTypeChange = (e: RadioChangeEvent) => {
        const type = e.target.value;
        setCurrentCoverType(type);
        // 同时更新表单中的 type 字段
        form.setFieldsValue({ type });

        // 如果切换到无图，清空图片列表
        if (type === 0) {
            setImageList([]);
        }
    };

    // 提交表单
    const onFinish = async (values: ArticleFormData) => {
        console.log('表单数据:', values);

        // 获取表单中的 type 值
        const { title, content, channel_id, type } = values;

        // 验证封面类型和图片数量
        if (type > 0 && imageList.length !== type) {
            messageApi.warning('封面类型和图片数量不匹配');
            return;
        }

        // 处理数据
        const reqData: CreateArticleRequest = {
            title,
            content,
            cover: {
                type: type,
                images: type === 0 ? [] : imageList.map(item =>
                    item.response?.data?.url || item.url || ''
                ).filter(url => url !== '')
            },
            channel_id,
        };

        console.log('提交数据:', reqData);

        try {
            await createArticleAPI(reqData);
            messageApi.success('创建成功');

            // 重置表单和状态
            form.resetFields();
            setImageList([]);
            setCurrentCoverType(0);
        } catch (error) {
            console.error('创建失败:', error);
            messageApi.error('创建失败，请重试');
        }
    };

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

    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传 JPG/PNG 文件!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片必须小于 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    const [imageList, setImageList] = useState<UploadFile[]>([]);

    const handleFileChange: UploadProps['onChange'] = (info) => {
        console.log('正在上传中', info);
        setImageList(info.fileList as UploadFile[]);
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    return (
        <div>
            {contextHolder}

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
                    } style={{ width: '100%', minHeight: '500px' }}>
                        <Form
                            {...layout}
                            form={form}
                            name="control-hooks"
                            onFinish={onFinish}
                            style={{ maxWidth: 600 }}
                            initialValues={{ type: 0 }}
                        >
                            <Form.Item name="title" label="标题" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="channel_id" label="频道" rules={[{ required: true }]}>
                                <Select
                                    allowClear
                                    placeholder="请选择频道"
                                    onChange={onGenderChange}
                                    options={channelList.map(channel => ({
                                        label: channel.name,
                                        value: channel.id,
                                    }))}
                                />
                            </Form.Item>

                            <Form.Item name="type" label="封面">
                                <Radio.Group
                                    onChange={onCoverTypeChange}
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

                                <div style={{ height: 20 }}></div>

                                {/* 直接根据 currentCoverType 状态显示上传组件 */}
                                {currentCoverType > 0 && (
                                    <Upload
                                        name="image"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={true}
                                        action="http://127.0.0.1:8001/v1/upload"
                                        beforeUpload={beforeUpload}
                                        onChange={handleFileChange}
                                        maxCount={currentCoverType}
                                        fileList={imageList}
                                    >
                                        {imageList.length >= currentCoverType ? null : uploadButton}
                                    </Upload>
                                )}
                            </Form.Item>

                            <Form.Item
                                label="内容"
                                name="content"
                                rules={[{ required: true, message: '请输入文章内容' }]}
                            >
                                <ReactQuill
                                    className="custom-quill"
                                    theme="snow"
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

export default Publish;