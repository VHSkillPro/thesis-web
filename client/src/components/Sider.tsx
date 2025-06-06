"use client";
import { useAuth } from "@/context/AuthContext";
import { HomeOutlined, ReadOutlined, UserOutlined } from "@ant-design/icons";
import { Menu, Space, Typography } from "antd";
import Sider from "antd/es/layout/Sider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface SiderProps {
  collapsed: boolean;
}

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

export default function MySider(props: SiderProps) {
  const router = useRouter();
  const path = usePathname();
  const { user } = useAuth();

  const menuItems = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: "Trang chủ",
      style: { fontWeight: "bold" },
      onClick: () => {
        router.push("/");
      },
    },
    {
      key: "students",
      icon: <UserOutlined />,
      label: "Sinh viên",
      style: { fontWeight: "bold" },
      onClick: () => {
        router.push("/students");
      },
    },
    {
      key: "classes",
      icon: <ReadOutlined />,
      label: "Lớp học",
      style: { fontWeight: "bold" },
      onClick: () => {
        router.push("/classes");
      },
    },
  ];

  if (user?.roleId === "admin") {
    menuItems.push({
      key: "lecturers",
      icon: <UserOutlined />,
      label: "Giảng viên",
      style: { fontWeight: "bold" },
      onClick: () => {
        router.push("/lecturers");
      },
    });
  }

  useEffect(() => {}, [path]);

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={props.collapsed}
      style={siderStyle}
    >
      <Space
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          letterSpacing: 1.5,
        }}
      >
        <Typography.Title
          level={props.collapsed ? 5 : 1}
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
        key={path}
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[path.split("/")[1] || "home"]}
        items={menuItems}
      />
    </Sider>
  );
}
