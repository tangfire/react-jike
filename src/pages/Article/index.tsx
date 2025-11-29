import React, {useEffect, useState} from 'react';
import {
    Button,
    Card,
    Col, DatePicker,
    Form,
    type FormProps, Popconfirm,
    Radio,

    Row, Select,
    Space, Table, Tag, Tooltip
} from 'antd';
import Column from "antd/es/table/Column";
import { EditOutlined,DeleteOutlined } from '@ant-design/icons';
import {useChannel} from "../../hooks/useChannel.tsx";
import {delArticleAPI, getArticleListAPI} from "../../apis/articles.jsx";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";

const Article: React.FC = () => {
    const navigate = useNavigate();
    const {channelList} = useChannel();
    const { RangePicker } = DatePicker;

    // 状态映射
    const statusMap = {
        '1': { text: '草稿', color: 'default' },
        '2': { text: '已发布', color: 'success' },
        '3': { text: '已封禁', color: 'error' }
    };

    const [list, setList] = useState([]);
    const [count, setCount] = useState(0);

    // 筛选功能参数
    const [reqData, setReqData] = useState({
        id:0,
        status: '',
        channel_id: '',
        begin_pubdate: '',  // 修正拼写：pubdata → pubdate
        end_pubdate: '',    // 修正拼写：pubdata → pubdate
        page: 1,
        page_size: 10,
    });

    useEffect(() => {
        async function getList(){
            const res = await getArticleListAPI(reqData);
            const formList = res.data.data.list.map(item => ({
                ...item,
                key: item.id,
                created_at: dayjs(item.created_at).format('YYYY-MM-DD HH:mm:ss'),
                cover_images: item.cover_images && item.cover_images.length > 0 ? item.cover_images.length : ['无封面'],
            }));
            setList(formList);
            setCount(res.data.data.total);
        }
        getList();
    }, [reqData]);

    // 修复后的 onFinish 函数
    const onFinish: FormProps['onFinish'] = (formValue) => {
        console.log('表单提交数据:', formValue);

        // 处理日期范围
        let begin_pubdate = '';
        let end_pubdate = '';

        if (formValue.time && formValue.time.length === 2) {
            begin_pubdate = formValue.time[0].format('YYYY-MM-DD');
            end_pubdate = formValue.time[1].format('YYYY-MM-DD');
        }

        setReqData({
            ...reqData,
            id: formValue.id,
            channel_id: formValue.channel_id,
            status: formValue.status,
            begin_pubdate,
            end_pubdate,
            page: 1, // 筛选时重置到第一页
            page_size: 100,
        });
    };

    const onFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
        console.log('表单提交失败:', errorInfo);
    };

    const deleteConfirm = async (data) => {
        console.log("删除点击了",data);
        await delArticleAPI(data.id)
        setReqData({
            ...reqData,
        })
    }

    const deleteCancel = () => {

    }

    return (
        <Row gutter={[16, 24]}>
            <Col className="gutter-row" span={24}>
                <Card style={{ width: '80%', margin: '20px auto' }}>
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600, marginTop: '20px' }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        initialValues={{
                            status: '1' // 设置默认值
                        }}
                    >
                        {/* 状态选择器 - 移除独立的 value 和 onChange */}
                        <Form.Item label="状态:" name="status">
                            <Radio.Group>
                                <Radio value={1}>草稿</Radio>
                                <Radio value={2}>已发布</Radio>
                                <Radio value={3}>已封禁</Radio>
                            </Radio.Group>
                        </Form.Item>

                        {/* 频道选择器 */}
                        <Form.Item label="频道" name="channel_id">
                            <Select
                                style={{ width: 120 }}
                                placeholder="请选择频道"
                                allowClear
                            >
                                {channelList.map(item => (
                                    <Select.Option key={item.id} value={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* 日期范围选择器 - 修正字段名 */}
                        <Form.Item label="日期" name="time">
                            <RangePicker />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                筛选
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>

            <Col className="gutter-row" span={24}>
                <Card title={`根据筛选条件查询到${count}条数据`} style={{ width: '80%', margin: '0 auto' }}>
                    {/* 表格内容保持不变 */}
                    <Table dataSource={list}
                           pagination={{
                               current: reqData.page,
                               pageSize: reqData.page_size,
                               total: count,
                               showSizeChanger: true,
                               showQuickJumper: true,
                               pageSizeOptions: ['10', '20', '50', '100'],
                               onChange: (page, pageSize) => {
                                   setReqData(prev => ({
                                       ...prev,
                                       page: page,
                                       page_size: pageSize || prev.page_size
                                   }));
                               },
                               showTotal: (total, range) =>
                                   `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`
                           }}>
                        <Column title="id" dataIndex="id" key="id" />
                        <Column title="封面" dataIndex="cover_images" key="cover_images" />
                        <Column title="标题" dataIndex="title" key="title" />
                        <Column
                            title="状态"
                            dataIndex="status"
                            key="status"
                            render={(status) => {
                                const statusInfo = statusMap[status];
                                return (
                                    <Tag color={statusInfo?.color || 'default'}>
                                        {statusInfo?.text || '未知'}
                                    </Tag>
                                );
                            }}
                        />
                        <Column title="发布时间" dataIndex="created_at" key="created_at" />
                        <Column title="阅读数" dataIndex="view_count" key="view_count" />
                        <Column title="评论数" dataIndex="comment_count" key="comment_count" />
                        <Column title="点赞数" dataIndex="like_count" key="like_count" />
                        <Column
                            title="操作"
                            key="action"
                            render={data => (
                                <Space size="middle">
                                    <Tooltip title="编辑">
                                        <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => navigate(`/publish?id=${data.id}`)} />
                                    </Tooltip>
                                    <Tooltip title="删除">
                                        <Popconfirm
                                            title="删除文章"
                                            description="确认要删除当前文章吗?"
                                            onConfirm={()=>deleteConfirm(data)}
                                            onCancel={deleteCancel}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} />
                                        </Popconfirm>

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