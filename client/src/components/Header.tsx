"use client";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, theme } from "antd";
import { Header } from "antd/es/layout/layout";
import UserDropdown from "./UserDropdown";

interface HeaderProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

export default function MyHeader(props: HeaderProps) {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
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
                    props.collapsed ? (
                        <MenuUnfoldOutlined />
                    ) : (
                        <MenuFoldOutlined />
                    )
                }
                onClick={() => props.setCollapsed(!props.collapsed)}
                style={{
                    fontSize: "16px",
                    width: 64,
                    height: 64,
                }}
            />
            <UserDropdown />
        </Header>
    );
}
