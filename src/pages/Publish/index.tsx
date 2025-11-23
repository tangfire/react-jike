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
import {useEffect, useState} from "react";
import {getChannelAPI,createArticleAPI} from '@/apis/articles.jsx'

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
// 定义频道接口
interface Channel {
    id: number;
    name: string;
}

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};
const Publish = () => {
    const [channelList, setChannelList] = useState<Channel[]>([])

    useEffect(() => {
        // 1. 封装函数 在函数体内调用接口
        const getChannelList = async ()=>{
            const res = await getChannelAPI();
            setChannelList(res.data.data.channels);
        }
        // 2. 调用函数
        getChannelList();

    },[])

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
        console.log(values);
        // 1. 按照接口文档的格式处理收集到的表单数据
        const {title,content,channel_id} = values;
        const reqData = {
            title,
            content,
            cover:{
                type:0,
                images:[]
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

    const [imgValue, setImgValue] = useState(1);

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

    const getBase64 = (img: FileType, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();

    const handleChange: UploadProps['onChange'] = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj as FileType, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
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

                                <Upload
                                    name="avatar"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                >
                                    {imageUrl ? (
                                        <img draggable={false} src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                                    ) : (
                                        uploadButton
                                    )}
                                </Upload>
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