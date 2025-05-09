"use client";
import {
  addStudentToClassAction,
  deleteStudentFromClassAction,
  getStudentsClassAction,
} from "@/app/(dashboard)/classes/[id]/action";
import { StudentFilterDto } from "@/app/(dashboard)/students/action";
import { useNotification } from "@/context/NotificationContext";
import Meta from "@/types/meta";
import {
  DeleteOutlined,
  EditOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Col,
  Form,
  Image,
  Input,
  Popconfirm,
  Row,
  Table,
  TableProps,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import StudentFilterComponent from "../../students/StudentFilter";

interface StudentsClassProps {
  id: string;
}

interface DataType {
  key: string;
  card: string;
  username: string;
  fullname: string;
  course: string;
  className: string;
  isActive: boolean;
}

interface AddStudentToClassForm {
  username: string;
}

export default function StudentsClass(props: StudentsClassProps) {
  const LIMIT_PER_PAGE = 5;
  const { notifySuccess, notifyError } = useNotification();

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [students, setStudents] = useState<DataType[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit: LIMIT_PER_PAGE,
    total: 0,
    pages: 0,
  });
  const [studentsFilter, setStudentsFilter] = useState<StudentFilterDto>({
    page: 1,
    limit: LIMIT_PER_PAGE,
  });

  const [form] = Form.useForm<AddStudentToClassForm>();

  const getStudentsClass = async () => {
    setIsFetching(true);

    const response = await getStudentsClassAction(props.id, studentsFilter);
    if (response.success) {
      const data = response.data.map((student: any) => ({
        key: student.username,
        ...student,
      }));

      setStudents(data);
      setMeta(response.meta);
    } else {
      notifyError(response.message);
    }

    setIsFetching(false);
  };

  const onFinishAddStudentToClass = async (values: AddStudentToClassForm) => {
    setIsFetching(true);
    const response = await addStudentToClassAction(props.id, values.username);
    if (response.success) {
      notifySuccess(response.message);
      form.resetFields();

      const newFilter = {
        ...studentsFilter,
      };
      setStudentsFilter(newFilter);
    } else {
      notifyError(response.message);
    }
    setIsFetching(false);
  };

  const onDeleteStudentFromClass = async (username: string) => {
    setIsFetching(true);
    const response = await deleteStudentFromClassAction(props.id, username);
    if (response.success) {
      notifySuccess(response.message);
      const newFilter = {
        ...studentsFilter,
      };

      if (meta) {
        const maxPages = Math.ceil((meta.total - 1) / meta.limit);
        if (newFilter.page && newFilter.page > maxPages) {
          newFilter.page = maxPages;
        }
      }

      setStudentsFilter(newFilter);
    } else {
      notifyError(response.message);
    }
    setIsFetching(false);
  };

  useEffect(() => {
    getStudentsClass();
  }, [props.id, studentsFilter]);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Thẻ sinh viên",
      dataIndex: "card",
      key: "card",
      render: (text) => <Image src={text} width={125} />,
    },
    {
      title: "Mã sinh viên",
      dataIndex: "username",
      key: "username",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Lớp",
      dataIndex: "className",
      key: "className",
    },
    {
      title: "Khóa học",
      dataIndex: "course",
      key: "course",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <span>
          {isActive ? (
            <Badge status="success" text="Hoạt động" />
          ) : (
            <Badge status="error" text="Bị khóa" />
          )}
        </span>
      ),
    },
    {
      title: (
        <>
          <EditOutlined style={{ marginRight: 5 }} />
          Thao tác
        </>
      ),
      key: "action",
      render: (_, record) => (
        <span>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sinh viên này khỏi lớp không?"
            okText="Có"
            cancelText="Không"
            placement="topLeft"
            onConfirm={() => onDeleteStudentFromClass(record.username)}
          >
            <Button color="danger" variant="filled" style={{ marginLeft: 8 }}>
              <DeleteOutlined></DeleteOutlined>
              Xóa khỏi lớp
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <>
      <Row style={{ marginTop: 20 }}>
        <Typography.Title level={2}>
          Danh sách sinh viên trong lớp
        </Typography.Title>
      </Row>
      <Row>
        <Col span={16}>
          <StudentFilterComponent
            filter={studentsFilter}
            setFilter={setStudentsFilter}
          ></StudentFilterComponent>
        </Col>
        <Col
          style={{ display: "flex", alignItems: "end", justifyContent: "end" }}
          span={8}
        >
          <Form
            form={form}
            layout="inline"
            style={{ display: "flex", alignItems: "end" }}
            onFinish={onFinishAddStudentToClass}
          >
            <Form.Item
              name="username"
              label="Mã sinh viên"
              layout="vertical"
              required
              rules={[{ required: true, message: "" }]}
            >
              <Input placeholder="Nhập mã sinh viên cần thêm"></Input>
            </Form.Item>
            <Button htmlType="submit" color="primary" variant="solid">
              <UserAddOutlined></UserAddOutlined>
              Thêm sinh viên
            </Button>
          </Form>
        </Col>
      </Row>
      <Table<DataType>
        style={{ marginTop: 16 }}
        columns={columns}
        dataSource={students}
        loading={isFetching}
        size="middle"
        pagination={{
          pageSize: meta?.limit || LIMIT_PER_PAGE,
          total: meta?.total || 0,
          current: meta?.page || 1,
          showTotal: (total) => `Tổng ${total} sinh viên`,
          onChange: (page, pageSize) => {
            const newFilter = {
              ...studentsFilter,
              page: page,
              limit: pageSize,
            };
            setStudentsFilter(newFilter);
          },
        }}
      />
    </>
  );
}
