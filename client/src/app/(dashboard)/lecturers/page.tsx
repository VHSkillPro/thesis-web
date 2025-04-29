"use client";
import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Col,
  Popconfirm,
  Row,
  Table,
  TableProps,
  Typography,
} from "antd";
import getLecturersAction, { FilterLecturerDto, LecturerDto } from "./action";
import { useNotification } from "@/context/NotificationContext";
import { MetaDto } from "@/types/meta";
import {
  DeleteOutlined,
  EditOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import LecturersFilter from "@/components/(dashboard)/lecturers/LecturersFilter";

interface DataType {
  key: string;
  username: string;
  fullname: string;
  isActive: boolean;
}

export default function LecturersPage() {
  const LIMIT_PER_PAGE = 10;

  const router = useRouter();
  const { notifyError, notifySuccess } = useNotification();

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [meta, setMeta] = useState<MetaDto>({
    page: 1,
    pages: 0,
    limit: LIMIT_PER_PAGE,
    total: 0,
  });
  const [lecturersFilter, setLecturersFilter] = useState<FilterLecturerDto>({
    username: undefined,
    fullname: undefined,
    isActive: undefined,
    page: 1,
    limit: LIMIT_PER_PAGE,
  });
  const [lecturers, setLecturers] = useState<DataType[]>([]);

  /**
   * Fetches a list of lecturers based on the provided filter criteria.
   * Updates the state with the fetched lecturers' data and metadata if the request is successful.
   * Displays an error notification if the request fails.
   *
   * @param {FilterLecturerDto} filter - The filter criteria for fetching lecturers.
   * @returns {Promise<void>} A promise that resolves when the fetching process is complete.
   */
  const getLecturers = async (filter: FilterLecturerDto) => {
    setIsFetching(true);

    const response = await getLecturersAction(filter);
    if (response.success) {
      const lecturersData: DataType[] = response.data.map(
        (lecturer: LecturerDto) => ({
          key: lecturer.username,
          username: lecturer.username,
          fullname: lecturer.fullname,
          isActive: lecturer.isActive,
        })
      );
      setLecturers(lecturersData);
      setMeta(response.meta);
    } else {
      notifyError(response.message);
    }

    setIsFetching(false);
  };

  useEffect(() => {
    getLecturers(lecturersFilter);
  }, [lecturersFilter]);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Mã giảng viên",
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
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) =>
        isActive ? (
          <Badge status="success" text="Hoạt động" />
        ) : (
          <Badge status="error" text="Bị khóa" />
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
            onClick={() => router.push(`/lecturers/${record.username}`)}
          >
            <EditOutlined />
            Chỉnh sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa giảng viên này không?"
            okText="Có"
            cancelText="Không"
            placement="topLeft"
            // onConfirm={() => onDeleteStudent(record.username)}
            description={
              <Typography.Text>
                Bạn không thể xóa giảng viên này <br /> nếu như có dữ liệu khác
                liên quan đến giảng viên này.
              </Typography.Text>
            }
          >
            <Button color="danger" variant="filled" style={{ marginLeft: 8 }}>
              <DeleteOutlined />
              Xóa
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <>
      <Typography.Title>Danh sách giảng viên</Typography.Title>
      <Row>
        <Col span={20}>
          <LecturersFilter
            lecturersFilter={lecturersFilter}
            setLecturersFilter={setLecturersFilter}
          />
        </Col>
        <Col
          style={{ display: "flex", alignItems: "end", justifyContent: "end" }}
          span={4}
        >
          <Button
            color="primary"
            variant="solid"
            onClick={() => router.push("/lecturers/create")}
          >
            <UserAddOutlined></UserAddOutlined>
            Thêm giảng viên
          </Button>
        </Col>
      </Row>
      <Table
        style={{ marginTop: 16 }}
        columns={columns}
        dataSource={lecturers}
        loading={isFetching}
        size="middle"
        pagination={{
          pageSize: meta.limit,
          total: meta.total,
          current: meta.page,
          showTotal: (total) => `Tổng ${total} giảng viên`,
          onChange: (page, pageSize) => {
            const newFilter = {
              ...lecturersFilter,
              page: page,
              limit: pageSize,
            };
            setLecturersFilter(newFilter);
          },
        }}
      />
    </>
  );
}
