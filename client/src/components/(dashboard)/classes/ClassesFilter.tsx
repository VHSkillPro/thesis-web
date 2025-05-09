import { ClassesFilterDto } from "@/app/(dashboard)/classes/action";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";

interface ClassesFilterForm {
  id?: string;
  name?: string;
  lecturerId?: string;
}

interface ClassesFilterProps {
  classesFilter: ClassesFilterDto;
  setClassesFilter: (filter: ClassesFilterDto) => void;
}

export default function ClassesFilter(props: ClassesFilterProps) {
  const [form] = Form.useForm<ClassesFilterForm>();

  const onFinish = (values: ClassesFilterForm) => {
    const newFilter = {
      id: values.id,
      name: values.name,
      lecturerId: values.lecturerId,
      page: 1,
      limit: props.classesFilter.limit,
    } as ClassesFilterDto;
    props.setClassesFilter(newFilter);
  };

  return (
    <Form
      layout="inline"
      form={form}
      style={{ display: "flex", width: "100%" }}
      onFinish={onFinish}
    >
      <Form.Item
        label="Mã lớp học"
        name="id"
        layout="vertical"
        style={{ flex: 1 }}
      >
        <Input placeholder="Nhập mã lớp học cần tìm kiếm (tương đối)" />
      </Form.Item>

      <Form.Item
        label="Tên lớp học"
        name="name"
        layout="vertical"
        style={{ flex: 1 }}
      >
        <Input placeholder="Nhập tên lớp học cần tìm kiếm (tương đối)" />
      </Form.Item>

      <Form.Item
        label="Mã giảng viên phụ trách"
        name="lecturerId"
        layout="vertical"
        style={{ flex: 1 }}
      >
        <Input placeholder="Nhập mã giảng viên phụ trách cần tìm kiếm (tương đối)" />
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
