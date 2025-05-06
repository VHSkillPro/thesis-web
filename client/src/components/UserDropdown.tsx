"use client";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { red } from "@ant-design/colors";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown, Skeleton, Space } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserDropdown() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const { notifySuccess, notifyError } = useNotification();
  const [isLoadingLogout, setIsLoadingLogout] = useState(false);

  const handleLogout = async () => {
    setIsLoadingLogout(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "GET",
      });

      const data: {
        success: boolean;
        message: string;
        statusCode: number;
      } = await response.json();
      if (data.success) {
        logout();
        notifySuccess("Đăng xuất thành công");
        router.push("/login");
      } else {
        throw new Error();
      }
    } catch (error) {
      notifyError("Đăng xuất thất bại");
    }

    setIsLoadingLogout(false);
  };

  if (isLoading) {
    return (
      <Space>
        <Skeleton.Avatar active={true} size="default" shape="circle" />
        <Skeleton.Input style={{ width: 100 }} active={true} size="small" />
      </Space>
    );
  }

  if (user) {
    return (
      <Dropdown
        menu={{
          items: [
            {
              key: "1",
              label: "Thông tin cá nhân",
              icon: <UserOutlined />,
              style: { fontWeight: "bold" },
              onClick: () => {
                router.push("/profile");
              },
            },
            {
              type: "divider",
            },
            {
              key: "2",
              label: "Đăng xuất",
              icon: <LogoutOutlined />,
              style: { color: red[5] },
              disabled: isLoadingLogout,
              onClick: handleLogout,
            },
          ],
        }}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space style={{ marginRight: 16 }}>
            <UserOutlined />
            {user.fullname}
          </Space>
        </a>
      </Dropdown>
    );
  }
}
