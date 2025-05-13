"use client";
import {
  Badge,
  Button,
  Col,
  Image,
  Popconfirm,
  Row,
  Table,
  TableProps,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import getStudentsAction, {
  deleteStudentAction,
  StudentFilterDto,
} from "./action";
import { useNotification } from "@/context/NotificationContext";
import {
  DeleteOutlined,
  EditOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import Meta from "@/types/meta";
import StudentFilterComponent from "@/components/(dashboard)/students/StudentFilter";
import { useRouter } from "next/navigation";

interface DataType {
  key: string;
  card: string;
  username: string;
  fullname: string;
  course: string;
  className: string;
  isActive: boolean;
}

export default function Page() {
  const PAGE_SIZE = 5;

  const router = useRouter();
  const { notifySuccess, notifyError } = useNotification();

  const [isFetching, setIsFetching] = useState(false);
  const [students, setStudents] = useState<DataType[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    pages: 0,
  });
  const [studentsFilter, setStudentsFilter] = useState<StudentFilterDto>({
    page: 1,
    limit: PAGE_SIZE,
  });

  const getStudents = async (studentsFilter: StudentFilterDto) => {
    setIsFetching(true);

    const response = await getStudentsAction(studentsFilter);
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

  const onDeleteStudent = async (studentId: string) => {
    const response = await deleteStudentAction(studentId);

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
  };

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
          <Button
            color="primary"
            variant="filled"
            onClick={() => router.push(`/students/${record.username}`)}
          >
            <EditOutlined></EditOutlined>
            Chi tiết
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sinh viên này không?"
            okText="Có"
            cancelText="Không"
            placement="topLeft"
            onConfirm={() => onDeleteStudent(record.username)}
            description={
              <Typography.Text>
                Xóa sinh viên sẽ xóa tất cả thông tin liên quan đên sinh viên
                này,
                <br />
                bao gồm thẻ sinh viên, ảnh chân dung, ...
              </Typography.Text>
            }
          >
            <Button color="danger" variant="filled" style={{ marginLeft: 8 }}>
              <DeleteOutlined></DeleteOutlined>
              Xóa
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  useEffect(() => {
    getStudents(studentsFilter);
  }, [studentsFilter]);

  return (
    <>
      <Row>
        <Typography.Title>Danh sách sinh viên</Typography.Title>
      </Row>
      <Row>
        <Col>
          <StudentFilterComponent
            filter={studentsFilter}
            setFilter={setStudentsFilter}
          ></StudentFilterComponent>
        </Col>
        <Col style={{ marginLeft: "auto", display: "flex", alignItems: "end" }}>
          <Button
            color="primary"
            variant="solid"
            onClick={() => router.push("/students/create")}
          >
            <UserAddOutlined></UserAddOutlined>
            Thêm sinh viên
          </Button>
        </Col>
      </Row>
      <Table<DataType>
        style={{ marginTop: 16 }}
        columns={columns}
        dataSource={students}
        loading={isFetching}
        size="middle"
        pagination={{
          pageSize: meta?.limit || PAGE_SIZE,
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
