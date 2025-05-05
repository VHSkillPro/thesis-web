"use client";
import { useNotification } from "@/context/NotificationContext";
import { PlusOutlined, RollbackOutlined } from "@ant-design/icons";
import { Button, Form, Input, Row, Switch, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createLecturerAction } from "./action";

interface CreateLecturerForm {
  username: string;
  password: string;
  fullname: string;
  isActive: boolean;
}

export default function CreateLecturerPage() {
  const router = useRouter();
  const { notifyError, notifySuccess } = useNotification();
  const [isContinuing, setIsContinuing] = useState<boolean>(false);
  const [form] = Form.useForm<CreateLecturerForm>();

  const onFinish = async (values: CreateLecturerForm) => {
    const response = await createLecturerAction(values);
    if (response.success) {
      notifySuccess(response.message);

      if (isContinuing) {
        form.resetFields();
        setIsContinuing(false);
      } else {
        router.push("/lecturers");
      }
    } else {
      if (Array.isArray(response.message)) {
        response.message.forEach((message: string) => notifyError(message));
      } else {
        notifyError(response.message);
      }
      setIsContinuing(false);
    }
  };

  return (
    <>
      <Row>
        <Typography.Title>Thêm giảng viên</Typography.Title>
      </Row>
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 20 }}
        onFinish={onFinish}
      >
        <Form.Item
          label={<strong>Mã giảng viên</strong>}
          name="username"
          required={true}
          rules={[
            { required: true, message: "Mã giảng viên không được để trống!" },
          ]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          label={<strong>Mật khẩu</strong>}
          name="password"
          required={true}
          rules={[{ required: true, message: "Mật khẩu không được để trống!" }]}
        >
          <Input type="password"></Input>
        </Form.Item>
        <Form.Item
          label={<strong>Họ và tên</strong>}
          name="fullname"
          required={true}
          rules={[
            { required: true, message: "Họ và tên không được để trống!" },
          ]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          initialValue={true}
          label={<strong>Trạng thái</strong>}
          name="isActive"
          layout="horizontal"
          required={true}
        >
          <Switch
            checkedChildren="Hoạt động"
            unCheckedChildren="Bị khóa"
            style={{ marginLeft: 10 }}
          />
        </Form.Item>
        <Form.Item>
          <Button
            variant="filled"
            color="primary"
            style={{ marginRight: 10 }}
            htmlType="submit"
          >
            <PlusOutlined></PlusOutlined>
            Thêm
          </Button>
          <Button
            variant="filled"
            color="primary"
            style={{ marginRight: 10 }}
            htmlType="submit"
            onClick={() => setIsContinuing(true)}
          >
            <PlusOutlined></PlusOutlined>
            Thêm và tiếp tục
          </Button>
          <Button
            variant="solid"
            color="danger"
            onClick={() => router.push("/lecturers")}
          >
            <RollbackOutlined />
            Quay lại
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
