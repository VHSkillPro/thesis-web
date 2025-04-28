"use client";
import {
  Badge,
  Button,
  Col,
  Image,
  Row,
  Table,
  TableProps,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import getStudentsAction, {
  getCardOfStudentAction,
  StudentFilter,
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
        <Button color="primary" variant="filled">
          <EditOutlined></EditOutlined>
          Chỉnh sửa
        </Button>
        <Button color="danger" variant="filled" style={{ marginLeft: 8 }}>
          <DeleteOutlined></DeleteOutlined>
          Xóa
        </Button>
      </span>
    ),
  },
];

export default function Page() {
  const router = useRouter();
  const [isFetching, setIsFetching] = useState(false);
  const { notifyError } = useNotification();

  const PAGE_SIZE = 5;
  const [meta, setMeta] = useState<Meta | undefined>(undefined);
  const [students, setStudents] = useState<DataType[]>([]);
  const [studentsFilter, setStudentsFilter] = useState({
    page: 1,
    limit: PAGE_SIZE,
  } as StudentFilter);

  const getStudents = async (studentsFilter: StudentFilter) => {
    setIsFetching(true);

    const response = await getStudentsAction(studentsFilter);
    if (response.success) {
      setMeta(response.meta);

      const data = response.data.map((student: any) => ({
        key: student.username,
        ...student,
      }));

      const listGetCardOfStudent = await Promise.all(
        data.map((student: any) => getCardOfStudentAction(student.username))
      );

      for (let i = 0; i < data.length; ++i) {
        if (listGetCardOfStudent[i].success) {
          data[i].card = listGetCardOfStudent[i].data.image;
        } else {
          notifyError(listGetCardOfStudent[i].message);
        }
      }

      setStudents(data);
    } else {
      notifyError(response.message);
    }

    setIsFetching(false);
  };

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
