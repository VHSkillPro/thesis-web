"use client";
import { StudentFilter } from "@/app/(dashboard)/students/action";
import { Button, Form, Input, Select } from "antd";

interface StudentFilterForm {
  username?: string;
  fullname?: string;
  course?: string;
  className?: string;
  isActive: boolean | string;
  page?: number;
  limit?: number;
}

interface StudentFilterProps {
  filter: StudentFilter;
  setFilter: (filter: StudentFilter) => void;
}

export default function StudentFilterComponent(props: StudentFilterProps) {
  const [form] = Form.useForm<StudentFilterForm>();

  return (
    <Form
      layout="inline"
      form={form}
      style={{ display: "flex", width: "100%" }}
      onFinish={(values) => {
        const newFilter = {
          username: values.username,
          fullname: values.fullname,
          course: values.course,
          className: values.className,
          isActive: values.isActive === "all" ? undefined : values.isActive,
          page: 1,
          limit: props.filter.limit,
        } as StudentFilter;

        props.setFilter(newFilter);
      }}
    >
      <Form.Item
        label="Mã sinh viên"
        name="username"
        layout="vertical"
        style={{ flex: 1 }}
      >
        <Input placeholder="Nhập mã sinh viên cần tìm kiếm (tương đối)"></Input>
      </Form.Item>

      <Form.Item
        label="Họ và tên"
        name="fullname"
        layout="vertical"
        style={{ flex: 1 }}
      >
        <Input placeholder="Nhập họ và tên sinh viên cần tìm kiếm (tương đối)"></Input>
      </Form.Item>

      <Form.Item
        label="Khóa học"
        name="course"
        layout="vertical"
        style={{ flex: 1 }}
      >
        <Input placeholder="Nhập khóa học cần tìm kiếm (tương đối)"></Input>
      </Form.Item>

      <Form.Item
        label="Lớp"
        name="className"
        layout="vertical"
        style={{ flex: 1 }}
      >
        <Input placeholder="Nhập lớp cần tìm kiếm (tương đối)"></Input>
      </Form.Item>

      <Form.Item
        label="Trạng thái"
        name="isActive"
        layout="vertical"
        style={{ width: 120 }}
      >
        <Select
          placeholder="Chọn trạng thái sinh viên"
          defaultValue={"all"}
          options={[
            {
              value: "all",
              label: "Tất cả",
            },
            {
              value: true,
              label: "Hoạt động",
            },
            { value: false, label: "Bị khóa" },
          ]}
        ></Select>
      </Form.Item>

      <Form.Item style={{ display: "flex", alignItems: "end" }}>
        <Button variant="filled" color="primary" htmlType="submit">
          Tìm kiếm
        </Button>
      </Form.Item>
    </Form>
  );
}
