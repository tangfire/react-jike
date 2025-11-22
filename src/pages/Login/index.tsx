import React from 'react';
import {type FormProps, Layout, message} from 'antd';
import {Card, Button, Form, Input } from 'antd';
import {useDispatch} from "react-redux";
import {fetchLogin} from '@/store/modules/user'
import {useNavigate} from "react-router-dom";
import {Content} from "antd/es/layout/layout";

type FieldType = {
    mobile?: string;
    code?: string;
};



const Login: React.FC = () => {


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('Success:', values);
        // 触发异步action fetchLogin
        await dispatch(fetchLogin(values));
        // 1. 跳转到首页
        navigate('/')
        // 2. 提示一下用户
        message.success('登录成功')
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (

        <Layout style={{ minHeight: '100vh' }}>
            <Content style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px'
            }}>
                <Card title="gopher zoo" style={{width: 300}}>
                    <Form
                        name="basic"
                        labelCol={{span: 8}}
                        wrapperCol={{span: 16}}
                        style={{maxWidth: 600}}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            label="Phone"
                            name="mobile"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your phone number!'
                                }
                                ,
                                {
                                    pattern: /^1[3-9]\d{9}$/,
                                    message: 'Please input your correct phone number!'
                                }
                            ]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Code"
                            name="code"
                            rules={[{required: true, message: 'Please input your code!'}]}
                        >
                            <Input/>
                        </Form.Item>


                        <Form.Item label={null}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Content>
        </Layout>




    );
}

export default Login;