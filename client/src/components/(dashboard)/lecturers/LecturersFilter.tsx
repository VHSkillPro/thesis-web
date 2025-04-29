import { FilterLecturerDto } from "@/app/(dashboard)/lecturers/action";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";

interface LecturersFilterForm {
  username?: string;
  fullname?: string;
  isActive?: boolean | string;
}

interface LecturersFilterProps {
  lecturersFilter: FilterLecturerDto;
  setLecturersFilter: (filter: FilterLecturerDto) => void;
}

export default function LecturersFilter(props: LecturersFilterProps) {
  const [form] = Form.useForm<LecturersFilterForm>();

  const onFinish = (values: LecturersFilterForm) => {
    const newFilter = {
      username: values.username,
      fullname: values.fullname,
      isActive: values.isActive === "all" ? undefined : values.isActive,
      page: 1,
      limit: props.lecturersFilter.limit,
    } as FilterLecturerDto;
    props.setLecturersFilter(newFilter);
  };

  return (
    <Form
      layout="inline"
      form={form}
      style={{ display: "flex", width: "100%" }}
      onFinish={onFinish}
    >
      <Form.Item
        label="Mã giảng viên"
        name="username"
        layout="vertical"
        style={{ flex: 1 }}
      >
        <Input placeholder="Nhập mã giảng viên cần tìm kiếm (tương đối)" />
      </Form.Item>

      <Form.Item
        label="Họ và tên"
        name="fullname"
        layout="vertical"
        style={{ flex: 1 }}
      >
        <Input placeholder="Nhập họ và tên cần tìm kiếm (tương đối)" />
      </Form.Item>

      <Form.Item
        label="Trạng thái"
        name="isActive"
        layout="vertical"
        style={{ width: 150 }}
        initialValue={"all"}
      >
        <Select
          placeholder="Chọn trạng thái"
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
        />
      </Form.Item>

      <Form.Item style={{ display: "flex", alignItems: "end" }}>
        <Button variant="filled" color="primary" htmlType="submit">
          <SearchOutlined />
          Tìm kiếm
        </Button>
      </Form.Item>
    </Form>
  );
}
