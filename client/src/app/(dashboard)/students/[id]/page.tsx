"use client";
import {
  Button,
  Col,
  Divider,
  Form,
  Image,
  Input,
  Row,
  Space,
  Spin,
  Switch,
  Typography,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import {
  getStudentDetailAction,
  updateStudentAction,
  UpdateStudentDto,
} from "./action";
import { useParams, useRouter } from "next/navigation";
import { useNotification } from "@/context/NotificationContext";
import { RcFile } from "antd/es/upload";
import { EditOutlined, RollbackOutlined } from "@ant-design/icons";

interface StudentFormDto {
  username: string;
  fullname: string;
  isActive: boolean;
  className: string;
  course: string;
  newPassword: string;
  reNewPassword: string;
}

export default function StudentDetailPage() {
  const router = useRouter();
  const { notifySuccess, notifyError } = useNotification();

  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm<StudentFormDto>();
  const [cardUri, setCardUri] = useState<string | undefined>(undefined);
  const [isLoadingCard, setIsLoadingCard] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isContinuing, setIsContinuing] = useState<boolean>(false);

  const getStudentDetail = async (studentId: string) => {
    setIsFetching(true);

    const response = await getStudentDetailAction(studentId);
    if (response.success) {
      const student = response.data;
      form.setFieldsValue({
        username: student.username,
        fullname: student.fullname,
        isActive: student.isActive,
        className: student.className,
        course: student.course,
      });
      setCardUri(student.card);
    } else {
      notifyError(response.message);
      router.push("/students");
    }

    setIsFetching(false);
  };

  useEffect(() => {
    getStudentDetail(id);
  }, [id]);

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      notifyError("Bạn chỉ có thể tải lên ảnh JPG/PNG");
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      notifyError("Kích thước ảnh phải nhỏ hơn 10MB");
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const onUploadCard = async (files: RcFile[]) => {
    setIsLoadingCard(true);

    if (files.length === 0) {
      return;
    }

    const response = await updateStudentAction(id, {
      card: files[0],
    });

    if (response.success) {
      notifySuccess("Cập nhật thẻ sinh viên thành công");
      getStudentDetail(id);
    } else {
      notifyError(response.message);
    }

    setIsLoadingCard(false);
  };

  const onFinish = async (values: StudentFormDto) => {
    const body: UpdateStudentDto = {
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

    const response = await updateStudentAction(id, body);

    if (response.success) {
      notifySuccess(response.message);
      if (!isContinuing) {
        router.push("/students");
      }
    } else {
      notifyError(response.message);
    }
    setIsContinuing(false);
  };

  if (isFetching) {
    return (
      <Space
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin></Spin>
      </Space>
    );
  }

  return (
    <>
      <Typography.Title>Thông tin chi tiết sinh viên</Typography.Title>
      <Form
        layout="vertical"
        style={{ marginTop: 20 }}
        form={form}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col span={18}>
            <Form.Item name="username" label={<strong>Mã sinh viên</strong>}>
              <Input disabled={true} style={{ fontWeight: "bold" }}></Input>
            </Form.Item>
            <Form.Item
              name="fullname"
              label={<strong>Họ và tên</strong>}
              required={true}
              rules={[
                { required: true, message: "Họ và tên không được trống" },
              ]}
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
          </Col>
          <Col span={6}>
            <Row justify={"space-between"} align="top">
              <Typography.Title level={5}>Thẻ sinh viên</Typography.Title>
              <Upload
                beforeUpload={beforeUpload}
                showUploadList={false}
                onChange={(file) => onUploadCard(file.fileList as RcFile[])}
                maxCount={1}
              >
                <Button variant="filled" size="small">
                  Tải ảnh thẻ sinh viên
                </Button>
              </Upload>
            </Row>
            {isLoadingCard ? (
              <Space
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spin></Spin>
              </Space>
            ) : (
              <Image src={cardUri}></Image>
            )}
          </Col>
        </Row>
        <Form.Item
          name="className"
          label={<strong>Lớp học</strong>}
          required={true}
          rules={[{ required: true, message: "Lớp học không được trống" }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          name="course"
          label={<strong>Khóa học</strong>}
          required={true}
          rules={[{ required: true, message: "Khóa học không được trống" }]}
        >
          <Input></Input>
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
