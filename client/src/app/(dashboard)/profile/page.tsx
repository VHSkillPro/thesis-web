"use client";
import Loading from "@/app/loading";
import { useAuth } from "@/context/AuthContext";
import { Button, Col, Divider, Form, Input, Row, Typography } from "antd";
import {
  changePasswordAction,
  ChangePasswordDto,
  getUserDetailAction,
} from "./action";
import { useNotification } from "@/context/NotificationContext";
import { useEffect, useState } from "react";
import { EditOutlined, RollbackOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface UserDetailForm {
  username: string;
  fullname: string;
  roleId: string;
  oldPassword: string;
  password: string;
  repassword: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { isLoading, user } = useAuth();
  const [form] = Form.useForm<UserDetailForm>();
  const { notifyError, notifySuccess } = useNotification();
  const [isContinuing, setIsContinuing] = useState<boolean>(false);

  const getUserDetail = async () => {
    if (!user) return;

    const response = await getUserDetailAction(user.username);
    if (response.success) {
      form.setFieldsValue({
        username: response.data.username,
        fullname: response.data.fullname,
        roleId:
          response.data.roleId === "admin" ? "Quản trị viên" : "Giảng viên",
      });
    } else {
      notifyError(response.message);
    }
  };

  const onFinish = async (values: UserDetailForm) => {
    if (!user) return;

    if (values.password !== values.repassword) {
      notifyError("Mật khẩu không khớp");
      return;
    }

    const formData: ChangePasswordDto = {
      oldPassword: values.oldPassword,
      password: values.password,
    };

    const response = await changePasswordAction(user.username, formData);

    if (response.success) {
      notifySuccess(response.message);
      if (!isContinuing) {
        router.back();
      }
    } else {
      notifyError(response.message);
    }
    setIsContinuing(false);
  };

  useEffect(() => {
    getUserDetail();
  }, [user]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Row>
        <Typography.Title>Thông tin cá nhân</Typography.Title>
      </Row>
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 20 }}
        onFinish={onFinish}
      >
        <Form.Item name="username" label={<strong>Mã sinh viên</strong>}>
          <Input
            disabled={true}
            style={{ fontWeight: "bold", color: "rgba(0, 0, 0, 0.85)" }}
          />
        </Form.Item>

        <Form.Item name="fullname" label={<strong>Họ và tên</strong>}>
          <Input disabled={true} style={{ color: "rgba(0, 0, 0, 0.85)" }} />
        </Form.Item>

        <Form.Item name="roleId" label={<strong>Chức vụ</strong>}>
          <Input disabled={true} style={{ color: "rgba(0, 0, 0, 0.85)" }} />
        </Form.Item>

        <Divider />

        <Typography.Title level={4} style={{ marginBottom: 20 }}>
          Đổi mật khẩu
        </Typography.Title>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="oldPassword"
              label={<strong>Mật khẩu cũ</strong>}
              required={true}
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ" }]}
            >
              <Input type="password"></Input>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="password"
              label={<strong>Mật khẩu mới</strong>}
              required={true}
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới" },
              ]}
            >
              <Input type="password"></Input>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="repassword"
              label={<strong>Nhập lại mật khẩu mới</strong>}
              required={true}
              rules={[
                { required: true, message: "Vui lòng nhập lại mật khẩu mới" },
              ]}
            >
              <Input type="password"></Input>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginTop: 20 }}>
          <Button
            variant="filled"
            color="primary"
            style={{ marginRight: 10 }}
            htmlType="submit"
          >
            <EditOutlined></EditOutlined>
            Cập nhật
          </Button>
          <Button
            variant="filled"
            color="primary"
            style={{ marginRight: 10 }}
            htmlType="submit"
            onClick={() => setIsContinuing(true)}
          >
            <EditOutlined></EditOutlined>
            Cập nhật và tiếp tục
          </Button>
          <Button variant="solid" color="danger" onClick={() => router.back()}>
            <RollbackOutlined />
            Quay lại
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
