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

export default function Page() {
  const PAGE_SIZE = 5;

  const router = useRouter();
  const { notifySuccess, notifyError } = useNotification();

  const [isFetching, setIsFetching] = useState(false);
  const [meta, setMeta] = useState<Meta | undefined>(undefined);
  const [students, setStudents] = useState<DataType[]>([]);
  const [studentsFilter, setStudentsFilter] = useState({
    page: 1,
    limit: PAGE_SIZE,
  } as StudentFilter);

  /**
   * Fetches a list of students based on the provided filter, retrieves additional card information
   * for each student, and updates the state with the processed data.
   *
   * @param {StudentFilter} studentsFilter - The filter criteria to fetch the students.
   *
   * @returns {Promise<void>} A promise that resolves when the fetching and processing are complete.
   *
   * @remarks
   * - Sets the `isFetching` state to `true` at the start and `false` at the end of the operation.
   * - Calls `getStudentsAction` to fetch the list of students and their metadata.
   * - Maps the student data to include a unique `key` property.
   * - Fetches card information for each student using `getCardOfStudentAction`.
   * - Updates the student data with the card image if the fetch is successful.
   * - Displays an error notification if fetching the card or the student list fails.
   * - Updates the `students` state with the processed data and `meta` state with metadata.
   */
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

  /**
   * Handles the deletion of a student by their ID.
   *
   * This function performs the following steps:
   * 1. Calls the `deleteStudentAction` to delete the student.
   * 2. If the deletion is successful:
   *    - Displays a success notification with the response message.
   *    - Updates the `studentsFilter` state to ensure the current page is valid
   *      based on the updated total number of students.
   * 3. If the deletion fails:
   *    - Displays an error notification with the response message.
   *
   * @param {string} studentId - The unique identifier of the student to be deleted.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
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
          <Button color="primary" variant="filled">
            <EditOutlined></EditOutlined>
            Chỉnh sửa
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
