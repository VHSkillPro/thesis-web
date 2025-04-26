"use client";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
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
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={["1"]}
                    items={[
                        {
                            key: "1",
                            icon: <UserOutlined />,
                            label: "nav 1",
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
                <Header style={{ padding: 0, background: colorBgContainer }}>
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
