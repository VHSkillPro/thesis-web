"use client";
import { useNotification } from "@/context/NotificationContext";
import { PlusOutlined, RollbackOutlined } from "@ant-design/icons";
import { Button, Form, Input, Row, Select, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllLecturersAction, LecturerDto } from "../../lecturers/action";
import { createClassesAction } from "./actions";

interface CreateClassForm {
  id: string;
  name: string;
  lecturerId: string;
}

export default function CreateClassPage() {
  const router = useRouter();
  const { notifyError, notifySuccess } = useNotification();
  const [isContinuing, setIsContinuing] = useState<boolean>(false);
  const [form] = Form.useForm<CreateClassForm>();

  const [lecturers, setLecturers] = useState<LecturerDto[]>([]);

  const onFinish = async (values: CreateClassForm) => {
    const response = await createClassesAction(values);
    if (response.success) {
      notifySuccess(response.message);

      if (isContinuing) {
        form.resetFields();
        setIsContinuing(false);
      } else {
        router.push("/classes");
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

  useEffect(() => {
    getAllLecturersAction().then((response) => {
      if (response.success) {
        setLecturers(response.data);
      } else {
        if (Array.isArray(response.message)) {
          response.message.forEach((message: string) => notifyError(message));
        } else {
          notifyError(response.message);
        }
        router.push("/classes");
      }
    });
  }, []);

  return (
    <>
      <Row>
        <Typography.Title>Thêm lớp học</Typography.Title>
      </Row>
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 20 }}
        onFinish={onFinish}
      >
        <Form.Item
          label={<strong>Mã lớp học</strong>}
          name="id"
          required={true}
          rules={[
            { required: true, message: "Mã lớp học không được để trống!" },
          ]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          label={<strong>Tên lớp học</strong>}
          name="name"
          required={true}
          rules={[
            { required: true, message: "Tên lớp học không được để trống!" },
          ]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          required
          name="lecturerId"
          label={<strong>Giảng viên</strong>}
          rules={[
            {
              required: true,
              message: "Giảng viên phụ trách không được để trống!",
            },
          ]}
          extra={
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              * Có thể tìm kiếm theo mã giảng viên
            </Typography.Text>
          }
        >
          <Select showSearch placeholder="Chọn giảng viên phụ trách">
            {lecturers.map((lecturer) => (
              <Select.Option key={lecturer.username} value={lecturer.username}>
                {lecturer.username} - {lecturer.fullname}
              </Select.Option>
            ))}
          </Select>
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
            onClick={() => router.push("/classes")}
          >
            <RollbackOutlined />
            Quay lại
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
