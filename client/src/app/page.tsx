"use client";
import UserDropdown from "@/components/UserDropdown";
import { gray, red } from "@ant-design/colors";
import {
    DownOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SettingOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import {
    Button,
    ColorPicker,
    Dropdown,
    Layout,
    Menu,
    MenuProps,
    Space,
    theme,
    Typography,
} from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";

const siderStyle: React.CSSProperties = {
    overflow: "auto",
    height: "100vh",
    position: "sticky",
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: "thin",
    scrollbarGutter: "stable",
};

const items: MenuProps["items"] = [
    {
        key: "1",
        label: "Thông tin cá nhân",
        icon: <UserOutlined />,
        style: { fontWeight: "bold" },
    },
    {
        type: "divider",
    },
    {
        key: "2",
        label: "Đăng xuất",
        icon: <LogoutOutlined />,
        style: { color: red[5] },
    },
];

export default function Home() {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={siderStyle}
            >
                <Space
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        letterSpacing: 1.5,
                        transition: "all 0.2s",
                    }}
                    hidden={collapsed}
                >
                    <Typography.Title
                        level={1}
                        style={{
                            color: "#d9d9d9",
                            textAlign: "center",
                            marginTop: 16,
                        }}
                    >
                        MSAA
                    </Typography.Title>
                </Space>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={["1"]}
                    items={[
                        {
                            key: "1",
                            icon: <UserOutlined />,
                            label: "Sinh viên",
                            style: { fontWeight: "bold" },
                        },
                        {
                            key: "2",
                            icon: <VideoCameraOutlined />,
                            label: "nav 2",
                        },
                        {
                            key: "3",
                            icon: <UploadOutlined />,
                            label: "nav 3",
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Button
                        type="text"
                        icon={
                            collapsed ? (
                                <MenuUnfoldOutlined />
                            ) : (
                                <MenuFoldOutlined />
                            )
                        }
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: "16px",
                            width: 64,
                            height: 64,
                        }}
                    />
                    <UserDropdown />
                </Header>
                <Content
                    style={{
                        marginTop: 24,
                        marginLeft: 16,
                        marginRight: 16,
                        padding: 24,
                        minHeight: 1000,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    Content
                </Content>
                <Footer style={{ textAlign: "center" }}>
                    Ngô Văn Hải © {new Date().getFullYear()}
                </Footer>
            </Layout>
        </Layout>
    );
}
