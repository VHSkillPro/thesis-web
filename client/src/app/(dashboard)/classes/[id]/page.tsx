"use client";
import {
  Button,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Skeleton,
  Typography,
} from "antd";
import { useNotification } from "@/context/NotificationContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getClassDetailAction, updateClassAction } from "./action";
import { getAllLecturersAction, LecturerDto } from "../../lecturers/action";
import { EditOutlined, RollbackOutlined } from "@ant-design/icons";
import StudentsClass from "@/components/(dashboard)/classes/detail/StudentsClass";
import { useAuth } from "@/context/AuthContext";

interface UpdatedClassForm {
  id: string;
  name: string;
  lecturerId: string;
}

export default function ClassDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { notifySuccess, notifyError } = useNotification();

  const [form] = Form.useForm<UpdatedClassForm>();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [lecturers, setLecturers] = useState<LecturerDto[]>([]);
  const [isContinuing, setIsContinuing] = useState<boolean>(false);

  const getClassDetail = async (id: string) => {
    setIsFetching(true);

    const respones = await Promise.all([
      getClassDetailAction(id),
      getAllLecturersAction(),
    ]);

    const classResponse = respones[0];
    if (classResponse.success) {
      form.setFieldsValue({
        id: classResponse.data.id,
        name: classResponse.data.name,
        lecturerId: classResponse.data.lecturerId,
      });
    } else {
      notifyError(classResponse.message);
      router.push("/classes");
    }

    const lecturerResponse = respones[1];
    if (lecturerResponse.success) {
      setLecturers(lecturerResponse.data);
    } else {
      if (Array.isArray(lecturerResponse.message)) {
        lecturerResponse.message.forEach((message: string) =>
          notifyError(message)
        );
      } else {
        notifyError(lecturerResponse.message);
      }
      router.push("/classes");
    }

    setIsFetching(false);
  };

  const onFinish = async (values: UpdatedClassForm) => {
    const updateClassDto = {
      name: values.name,
      lecturerId: values.lecturerId,
    };
    const response = await updateClassAction(id, updateClassDto);

    if (response.success) {
      notifySuccess(response.message);
      if (!isContinuing) {
        router.push("/classes");
      }
    } else {
      notifyError(response.message);
    }
    setIsContinuing(false);
  };

  useEffect(() => {
    getClassDetail(id);
  }, [id]);

  return (
    <>
      <Row>
        <Typography.Title>Chi tiết lớp học</Typography.Title>
      </Row>
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 20 }}
        onFinish={onFinish}
      >
        <Form.Item name="id" label={<strong>Mã lớp học</strong>}>
          {isFetching ? (
            <Skeleton.Input active block />
          ) : (
            <Input
              disabled={true}
              style={{ fontWeight: "bold", color: "rgba(0, 0, 0, 0.85)" }}
            />
          )}
        </Form.Item>

        <Form.Item
          name="name"
          label={<strong>Tên lớp học</strong>}
          required={user?.roleId === "admin"}
          rules={[{ required: true, message: "Vui lòng nhập tên lớp học" }]}
        >
          {isFetching ? (
            <Skeleton.Input active block />
          ) : (
            <Input
              disabled={user?.roleId !== "admin"}
              style={{ color: "rgba(0, 0, 0, 0.85)" }}
            />
          )}
        </Form.Item>

        <Form.Item
          name="lecturerId"
          label={<strong>Giảng viên phụ trách</strong>}
          required={user?.roleId === "admin"}
          rules={[
            { required: true, message: "Vui lòng chọn giảng viên phụ trách" },
          ]}
          extra={
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              * Có thể tìm kiếm theo mã giảng viên
            </Typography.Text>
          }
        >
          {isFetching ? (
            <Skeleton.Input active block />
          ) : (
            <Select
              showSearch
              placeholder="Chọn giảng viên phụ trách"
              disabled={user?.roleId !== "admin"}
            >
              {lecturers.map((lecturer) => (
                <Select.Option
                  key={lecturer.username}
                  value={lecturer.username}
                >
                  <Typography.Text>
                    {lecturer.username} - {lecturer.fullname}
                  </Typography.Text>
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item style={{ marginTop: 20 }}>
          <Button
            variant="filled"
            color="primary"
            style={{ marginRight: 10 }}
            htmlType="submit"
            disabled={user?.roleId !== "admin"}
          >
            <EditOutlined></EditOutlined>
            Cập nhật
          </Button>
          <Button
            variant="filled"
            color="primary"
            style={{ marginRight: 10 }}
            htmlType="submit"
            disabled={user?.roleId !== "admin"}
            onClick={() => setIsContinuing(true)}
          >
            <EditOutlined></EditOutlined>
            Cập nhật và tiếp tục
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
      <Divider />
      <StudentsClass id={id} />
    </>
  );
}
