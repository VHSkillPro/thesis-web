"use client";
import { useNotification } from "@/context/NotificationContext";
import {
  Button,
  Col,
  Popconfirm,
  Row,
  Table,
  TableProps,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MetaDto } from "@/types/meta";
import {
  ClassesFilterDto,
  deleteClassAction,
  getClassesAction,
} from "./action";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import ClassesFilter from "@/components/(dashboard)/classes/ClassesFilter";

interface DataType {
  key: string;
  id: string;
  name: string;
  lecturerId: string;
}

export default function ClassesPage() {
  const LIMIT_PER_PAGE: number = 10;

  const router = useRouter();
  const { notifyError, notifySuccess } = useNotification();

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [meta, setMeta] = useState<MetaDto>({
    page: 1,
    pages: 0,
    limit: LIMIT_PER_PAGE,
    total: 0,
  });
  const [classesFilter, setClassesFilter] = useState<ClassesFilterDto>({
    id: undefined,
    name: undefined,
    lecturerId: undefined,
    page: 1,
    limit: LIMIT_PER_PAGE,
  });
  const [classes, setClasses] = useState<DataType[]>([]);

  const getClasses = async (filter: ClassesFilterDto) => {
    setIsFetching(true);

    const response = await getClassesAction(filter);
    if (response.success) {
      const classesData: DataType[] = response.data.map((item: any) => ({
        key: item.id,
        id: item.id,
        name: item.name,
        lecturerId: item.lecturerId,
      }));

      setClasses(classesData);
      setMeta(response.meta);
    } else {
      notifyError("Lấy danh sách lớp học thất bại");
    }

    setIsFetching(false);
  };

  useEffect(() => {
    getClasses(classesFilter);
  }, [classesFilter]);

  const onDeleteClasses = async (id: string) => {
    const response = await deleteClassAction(id);
    if (response.success) {
      notifySuccess(response.message);
      const newFilter = {
        ...classesFilter,
      };

      if (meta) {
        const maxPages = Math.ceil((meta.total - 1) / meta.limit);
        if (newFilter.page && newFilter.page > maxPages) {
          newFilter.page = maxPages;
        }
      }

      setClassesFilter(newFilter);
    } else {
      notifyError(response.message);
    }
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Mã lớp học",
      dataIndex: "id",
      key: "id",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Tên lớp học",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mã giảng viên phụ trách",
      dataIndex: "lecturerId",
      key: "lecturerId",
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
            onClick={() => router.push(`/classes/${record.id}`)}
          >
            <EditOutlined />
            Chi tiết
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa lớp này không?"
            okText="Có"
            cancelText="Không"
            placement="topRight"
            onConfirm={() => onDeleteClasses(record.id)}
            description={
              <Typography.Text>
                Bạn không thể xóa lớp này <br /> nếu như có dữ liệu khác liên
                quan đến lớp này.
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
      <Typography.Title>Danh sách lớp học</Typography.Title>
      <Row>
        <Col span={20}>
          <ClassesFilter
            classesFilter={classesFilter}
            setClassesFilter={setClassesFilter}
          />
        </Col>
        <Col
          style={{ display: "flex", alignItems: "end", justifyContent: "end" }}
          span={4}
        >
          <Button
            color="primary"
            variant="solid"
            onClick={() => router.push("/classes/create")}
          >
            <PlusCircleOutlined />
            Thêm lớp học
          </Button>
        </Col>
      </Row>
      <Table
        style={{ marginTop: 16 }}
        columns={columns}
        dataSource={classes}
        loading={isFetching}
        size="middle"
        pagination={{
          pageSize: meta.limit,
          total: meta.total,
          current: meta.page,
          showTotal: (total) => `Tổng ${total} giảng viên`,
          onChange: (page, pageSize) => {
            const newFilter = {
              ...classesFilter,
              page: page,
              limit: pageSize,
            };
            setClassesFilter(newFilter);
          },
        }}
      />
    </>
  );
}
