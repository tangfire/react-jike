import React from 'react';
import type { FormProps } from 'antd';
import {Card, Button, Form, Input } from 'antd';

type FieldType = {
    phone?: string;
    code?: string;
};

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const Login: React.FC = () => (

    <Card title="gopher zoo"  style={{ width: 300 }}>
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item<FieldType>
                label="Phone"
                name="phone"
                rules={[
                    {
                        required: true,
                        message: 'Please input your phone!' }
                    ,
                    {
                        pattern: /^1[3-9]\d{9}$/,
                        message: 'Please input your correct phone number!'
                    }
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item<FieldType>
                label="Code"
                name="code"
                rules={[{ required: true, message: 'Please input your code!' }]}
            >
                <Input />
            </Form.Item>



            <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    </Card>


);

export default Login;