import React, {useEffect, useState} from 'react';
import {
    Button,
    Card,

    Col, DatePicker,
    Flex,
    Form,
    type FormProps,

    Radio,
    type RadioChangeEvent,
    Row, Select,
    Space, Table, Tag, Tooltip
} from 'antd';
import Column from "antd/es/table/Column";
import { EditOutlined,DeleteOutlined } from '@ant-design/icons';
import {useChannel} from "../../hooks/useChannel.tsx";
import {getArticleListAPI} from "../../apis/articles.jsx";
import dayjs from  "dayjs";


const Article: React.FC = () => {
    const {channelList} = useChannel();

    type FieldType = {
        status?: string;
        channel_id?: string;
        time?: string;
    };

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const [value, setValue] = useState(1);

    const onChange = (e: RadioChangeEvent) => {
        setValue(e.target.value);
    };
    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
    };

    // 状态映射
    const statusMap = {
        '1': { text: '草稿', color: 'default' },
        '2': { text: '已发布', color: 'success' },
        '3': { text: '已封禁', color: 'error' }
    };

    const { RangePicker } = DatePicker;

    const [count, setCount] = useState(0)
    const [list, setList] = useState([])
    useEffect(() => {
        async function getList(){
            const res = await getArticleListAPI()
            const formList = res.data.data.list.map(item =>(
                {
                    ...item,
                    key: item.id,
                    // 格式化时间
                    created_at: dayjs(item.created_at).format('YYYY-MM-DD HH:mm:ss'),
                    // 处理封面图片显示
                    cover_images: item.cover_images && item.cover_images.length > 0?item.cover_images.length : ['无封面'],
                }
            ));
            setList(formList)
            setCount(res.data.data.total)
        }
        getList();

    },[])

    // 筛选功能
    // 1. 准备参数
    const [reqData, setReqData] = useState({
        status: '',
        channel_id: '',
        begin_pudata:'',
        end_pudata:'',
        page: 1,
        per_page: 4,
    })

    // 2. 获取当前的筛选数据


    return(
    <Row gutter={[16, 24]}>
        <Col className="gutter-row" span={24}>
            <Card style={{ width: '80%',margin: '20px auto' }}>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 ,marginTop: '20px' }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="状态:"
                        name="status"
                        rules={[{  message: 'Please input your username!' }]}
                    >
                        <Radio.Group
                            onChange={onChange}
                            value={value}
                            options={[
                                {
                                    value: 1,
                                    className: 'option-1',
                                    label: (
                                        <Flex gap="small" justify="center" align="center" vertical>

                                            全部
                                        </Flex>
                                    ),
                                },
                                {
                                    value: 2,
                                    className: 'option-2',
                                    label: (
                                        <Flex gap="small" justify="center" align="center" vertical>

                                            已发布
                                        </Flex>
                                    ),
                                },
                                {
                                    value: 3,
                                    className: 'option-3',
                                    label: (
                                        <Flex gap="small" justify="center" align="center" vertical>

                                            已封禁
                                        </Flex>
                                    ),
                                },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="频道"
                        name="channel_id"
                    >
                        <Select
                            style={{ width: 120 }}
                            onChange={handleChange}
                            options={channelList.map(item => ({key:item.id ,value: item.id,label: item.name }))}
                        />
                    </Form.Item>

                    <Form.Item<FieldType> label='日期' name="time" valuePropName="checked" >
                        <RangePicker />
                    </Form.Item>

                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit">
                            筛选
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Col>
        <Col className="gutter-row" span={24}>
            <Card title={`根据筛选条件查询到${count}条数据`}  style={{ width: '80%' ,margin: '0 auto' }}>
                <Table dataSource={list}>
                    <Column title="封面" dataIndex="cover_images" key="age" />
                    <Column title="标题" dataIndex="title" key="address" />
                    <Column
                        title="状态"
                        dataIndex="status"
                        key="status"
                        render={(status) => {
                            // @ts-ignore
                            const statusInfo = statusMap[status];
                            return (
                                <Tag color={statusInfo?.color || 'default'}>
                                    {statusInfo?.text || '未知'}
                                </Tag>
                            );
                        }}
                    />
                    <Column title="发布时间" dataIndex="created_at" key="time" />
                    <Column title="阅读数" dataIndex="view_count" key="view_count" />
                    <Column title="评论数" dataIndex="comment_count" key="comment_count" />
                    <Column title="点赞数" dataIndex="like_count" key="like_count" />
                    <Column
                        title="Action"
                        key="action"
                        render={(_: any) => (
                            <Space size="middle">
                                <Tooltip title="编辑">
                                    <Button type="primary" shape="circle" icon={<EditOutlined />} />
                                </Tooltip>
                                <Tooltip title="禁用">
                                <Button type="primary" shape="circle" icon={<DeleteOutlined />}>
                                </Button>
                                </Tooltip>
                            </Space>
                        )}
                    />
                </Table>
            </Card>
        </Col>


    </Row>


);
}

export default Article;