"use client";
import { useNotification } from "@/context/NotificationContext";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Switch,
  Typography,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getLecturerDetailAction,
  updateLecturerAction,
  UpdateLecturerDto,
} from "./action";
import { EditOutlined, RollbackOutlined } from "@ant-design/icons";

interface LecturerForm {
  username: string;
  fullname: string;
  isActive: boolean;
  newPassword: string;
  reNewPassword: string;
}

export default function LecturerDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { notifySuccess, notifyError } = useNotification();

  const [form] = Form.useForm<LecturerForm>();
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isContinuing, setIsContinuing] = useState<boolean>(false);

  const getLecturerDetail = async (username: string) => {
    setIsFetching(true);

    const response = await getLecturerDetailAction(username);
    if (response.success) {
      const lecturer = response.data;
      form.setFieldsValue({
        username: lecturer.username,
        fullname: lecturer.fullname,
        isActive: lecturer.isActive,
      });
    } else {
      notifyError(response.message);
      router.push("/lecturers");
    }

    setIsFetching(false);
  };

  const onFinish = async (values: LecturerForm) => {
    const body: UpdateLecturerDto = {
      ...values,
      isActive: values.isActive,
    };

    if (values.newPassword && values.reNewPassword) {
      if (values.newPassword !== values.reNewPassword) {
        notifyError("Mật khẩu không khớp");
        return;
      }
      body.password = values.newPassword;
    }

    const response = await updateLecturerAction(id, body);

    if (response.success) {
      notifySuccess(response.message);
      if (!isContinuing) {
        router.push("/lecturers");
      }
    } else {
      notifyError(response.message);
    }
    setIsContinuing(false);
  };

  useEffect(() => {
    getLecturerDetail(id);
  }, [id]);

  return (
    <>
      <Row>
        <Typography.Title>Chi tiết giảng viên</Typography.Title>
      </Row>
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 20 }}
        onFinish={onFinish}
      >
        <Form.Item name="username" label={<strong>Mã giảng viên</strong>}>
          <Input disabled={true} style={{ fontWeight: "bold" }}></Input>
        </Form.Item>
        <Form.Item
          name="fullname"
          label={<strong>Họ và tên</strong>}
          required={true}
          rules={[{ required: true, message: "Họ và tên không được trống" }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          name="isActive"
          label={<strong>Trạng thái</strong>}
          layout="horizontal"
        >
          <Switch
            checkedChildren="Hoạt động"
            unCheckedChildren="Bị khóa"
            style={{ marginLeft: 10 }}
          ></Switch>
        </Form.Item>

        <Divider></Divider>
        <Typography.Title level={4} style={{ marginBottom: 20 }}>
          Đổi mật khẩu
        </Typography.Title>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="newPassword" label={<strong>Mật khẩu mới</strong>}>
              <Input type="password"></Input>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="reNewPassword"
              label={<strong>Nhập lại mật khẩu mới</strong>}
            >
              <Input type="password"></Input>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
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
