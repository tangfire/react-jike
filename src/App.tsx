import { Layout, Button, Card } from 'antd';

const { Content } = Layout;

function App() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Content style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px'
            }}>
                <Card title="居中卡片" style={{ width: 400 }}>
                    <Button type="primary">按钮</Button>
                </Card>
            </Content>
        </Layout>
    );
}

export default App;