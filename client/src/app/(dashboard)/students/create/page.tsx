"use client";
import { useNotification } from "@/context/NotificationContext";
import {
  PlusOutlined,
  RollbackOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Row, Switch, Typography, Upload } from "antd";
import { useRouter } from "next/navigation";
import createStudentAction, { CreateStudentDto } from "./action";
import { useState } from "react";

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export default function CreateStudentPage() {
  const router = useRouter();
  const { notifyError, notifySuccess } = useNotification();
  const [isContinuing, setIsContinuing] = useState<boolean>(false);
  const [form] = Form.useForm<CreateStudentDto>();

  const onFinish = async (values: CreateStudentDto) => {
    const response = await createStudentAction(values);
    if (response.success) {
      notifySuccess(response.message);

      if (isContinuing) {
        form.resetFields();
        setIsContinuing(false);
      } else {
        router.push("/students");
      }
    } else {
      if (Array.isArray(response.message)) {
        response.message.forEach((message) => notifyError(message));
      } else {
        notifyError(response.message);
      }
      setIsContinuing(false);
    }
  };

  const handleBeforeUpload = (file: File) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      notifyError("Ảnh thẻ sinh viên phải là định dạng JPG hoặc PNG!");
      return Upload.LIST_IGNORE;
    }

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      notifyError("Ảnh thẻ sinh viên phải nhỏ hơn 10MB!");
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  return (
    <>
      <Row>
        <Typography.Title>Thêm sinh viên</Typography.Title>
      </Row>
      <Form
        layout="vertical"
        style={{ marginTop: 20 }}
        form={form}
        onFinish={onFinish}
      >
        <Form.Item
          label={<strong>Mã sinh viên</strong>}
          name="username"
          required={true}
          rules={[
            { required: true, message: "Mã sinh viên không được để trống!" },
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
        <Form.Item
          label={<strong>Lớp học</strong>}
          name="className"
          required={true}
          rules={[{ required: true, message: "Lớp học không được để trống!" }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          label={<strong>Khóa học</strong>}
          name="course"
          required={true}
          rules={[{ required: true, message: "Khóa học không được để trống!" }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          name="card"
          label={<strong>Thẻ sinh viên</strong>}
          required={true}
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            { required: true, message: "Thẻ sinh viên không được để trống!" },
          ]}
          extra="Chỉ chấp nhận định dạng JPG hoặc PNG, dung lượng tối đa 10MB"
        >
          <Upload
            listType="picture"
            beforeUpload={handleBeforeUpload}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Tải ảnh thẻ sinh viên</Button>
          </Upload>
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
            onClick={() => router.push("/students")}
          >
            <RollbackOutlined />
            Quay lại
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
