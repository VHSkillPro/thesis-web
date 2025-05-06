"use client";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Layout, Space, Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import loginAction, { LoginFormData } from "./action";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types/user";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError } = useNotification();
  const { login, logout } = useAuth();

  const onFinish = async (formData: LoginFormData) => {
    setLoading(true);
    const response = await loginAction(formData);
    if (response.success) {
      try {
        const meResponse = await fetch("/api/auth/me");
        const json = await meResponse.json();
        if (json.success && json.data.roleId !== "student") {
          login(json.data as User);
          notifySuccess(response.message);
          router.push("/");
        } else {
          await fetch("/api/auth/logout");
          notifyError("Bạn không có quyền truy cập vào trang này.");
        }
      } catch (error) {
        await fetch("/api/auth/logout");
        notifyError("Đã xảy ra lỗi khi lấy thông tin người dùng.");
      }
    } else {
      await fetch("/api/auth/logout");
      notifyError(response.message);
    }
    setLoading(false);
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          style={{
            width: 450,
            borderRadius: 16,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Space
            direction="vertical"
            size="middle"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Typography.Title
              level={1}
              style={{
                textAlign: "center",
                marginTop: 6,
                marginBottom: 32,
              }}
            >
              Đăng nhập
            </Typography.Title>
          </Space>

          <Form name="normal_login" className="login-form" onFinish={onFinish}>
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên đăng nhập!",
                },
              ]}
            >
              <Input
                prefix={
                  <UserOutlined
                    className="site-form-item-icon"
                    style={{ marginRight: 5 }}
                  />
                }
                placeholder="Tên đăng nhập"
                size="large"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu!",
                },
              ]}
              style={{ marginTop: 40 }}
            >
              <Input.Password
                prefix={
                  <LockOutlined
                    className="site-form-item-icon"
                    style={{ marginRight: 5 }}
                  />
                }
                type="password"
                placeholder="Mật khẩu"
                size="large"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item style={{ marginTop: 40 }}>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                style={{ width: "100%" }}
                size="large"
                disabled={loading}
                loading={loading}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
}
