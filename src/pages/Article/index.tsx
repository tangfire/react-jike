import React, {useState} from 'react';
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

const Article: React.FC = () => {
    const style: React.CSSProperties = { background: '#0092ff', padding: '8px 0' };
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

    const { RangePicker } = DatePicker;

    interface DataType {
        key: React.Key;
        firstName: string;
        lastName: string;
        age: number;
        address: string;
        tags: string[];
    }

    const data: DataType[] = [
        {
            key: '1',
            firstName: 'John',
            lastName: 'Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer'],
        },
        {
            key: '2',
            firstName: 'Jim',
            lastName: 'Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['loser'],
        },
        {
            key: '3',
            firstName: 'Joe',
            lastName: 'Black',
            age: 32,
            address: 'Sydney No. 1 Lake Park',
            tags: ['cool', 'teacher'],
        },
    ];
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
            <Card title="根据筛选条件查询到5条结果:"  style={{ width: '80%' ,margin: '0 auto' }}>
                <Table<DataType> dataSource={data}>
                    <Column title="封面" dataIndex="cover_images" key="age" />
                    <Column title="标题" dataIndex="title" key="address" />
                    <Column
                        title="状态"
                        dataIndex="tags"
                        key="tags"
                        render={(tags: string[]) => (
                            <Flex gap="small" align="center" wrap>
                                {tags.map((tag) => {
                                    let color = tag.length > 5 ? 'geekblue' : 'green';
                                    if (tag === 'loser') {
                                        color = 'volcano';
                                    }
                                    return (
                                        <Tag color={color} key={tag}>
                                            {tag.toUpperCase()}
                                        </Tag>
                                    );
                                })}
                            </Flex>
                        )}
                    />
                    <Column title="发布时间" dataIndex="time" key="time" />
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