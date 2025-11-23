import React, {useEffect, useState} from 'react';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,

} from '@ant-design/icons';
import {Button, type MenuProps, Popconfirm, type PopconfirmProps} from 'antd';
import { Breadcrumb, Layout, Menu} from 'antd';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
// @ts-ignore
import {fetchUserInfo,clearUserInfo} from '@/store/modules/user'
import {Header} from "antd/es/layout/layout";

const {  Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('首页', '/', <PieChartOutlined />),
    getItem('文章管理', '/article', <DesktopOutlined />),
    getItem('创建文章', '/publish', <FileOutlined />),
];

const MyLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [menuItem,setMenuItem] = useState('');
    const navigate = useNavigate();
    const menuItemMap = new Map<string, string>(
        [
            ['/','Home'],
            ['/article','Article'],
            ['/publish','Publish'],
        ]
    );
    const onMenuClick = (router:{key:string}) => {
        console.log("menu has been clicked",router);
        const path = router.key
        setMenuItem(router.key);
        navigate(path);
    }

    // 反向高亮
    // 1. 获取当前路由路径
    const location = useLocation();
    const selectedkey = location.pathname;

    // 触发个人用户信息action
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(fetchUserInfo());
    },[dispatch])

    useEffect(() => {
        setMenuItem(selectedkey);
    }, [selectedkey]);

    // @ts-ignore
    const name = useSelector(state => state.user.userInfo.nickname);


    const confirm: PopconfirmProps['onConfirm'] = () => {
       dispatch(clearUserInfo());
       navigate('/login');
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu theme="dark" defaultSelectedKeys={[selectedkey]} mode="inline" items={items} onClick={onMenuClick} />
            </Sider>
            <Layout>
                <Header style={{
                    padding: '0 16px',
                    background: "white",
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                }}>
                    <span style={{marginRight: '16px'}}>{name}</span>
                    <Popconfirm
                        title="Are you sure to exit this system?"
                        onConfirm={confirm}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger>Exit</Button>
                    </Popconfirm>
                </Header>
                <Content style={{margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }} items={[{ title:menuItemMap.get(menuItem) }]} />
                    <div
                        style={{
                            padding: '16px', // 在移动端减少内边距
                            background: "white",
                            minHeight: 'calc(100vh - 150px)', // 动态计算最小高度
                        }}
                    >
                        {/*二级路由的出口*/}
                        <Outlet></Outlet>
                    </div>
                </Content>

            </Layout>
        </Layout>
    );
};

export default MyLayout;