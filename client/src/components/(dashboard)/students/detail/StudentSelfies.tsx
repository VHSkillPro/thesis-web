import { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Image, Popconfirm, Table, Typography } from "antd";

import AddStudentSelfie from "./AddStudentSelfie";
import { getSelfiesAction } from "@/app/(dashboard)/students/[id]/action";
import { useNotification } from "@/context/NotificationContext";

interface StudentSelfiesProps {
  id: string;
}

interface DataType {
  key: string;
  id: string;
  selfieUri: string;
}

export default function StudentSelfies(props: StudentSelfiesProps) {
  const [selfies, setSelfies] = useState<DataType[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const { notifyError } = useNotification();

  const getSelfies = async () => {
    setIsFetching(true);

    const response = await getSelfiesAction(props.id);
    if (response.success) {
      const _selfies: DataType[] = response.data.map((selfie: any) => ({
        key: selfie.id,
        id: selfie.id,
        selfieUri: selfie.image,
      }));
      setSelfies(_selfies);
    } else {
      notifyError(response.message);
    }

    setIsFetching(false);
  };

  useEffect(() => {
    getSelfies();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Ảnh chân dung",
      dataIndex: "selfieUri",
      key: "selfieUri",
      render: (text: string) => <Image src={text} height={100} />,
    },
    {
      title: (
        <>
          <EditOutlined style={{ marginRight: 5 }} />
          Thao tác
        </>
      ),
      key: "action",
      render: (_: string, record: DataType) => (
        <span>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sinh viên này không?"
            okText="Có"
            cancelText="Không"
            placement="topLeft"
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

  return (
    <>
      <Typography.Title level={2}>Danh sách ảnh chân dung</Typography.Title>
      <AddStudentSelfie id={props.id} onChange={getSelfies} />
      <Table
        style={{ marginTop: 16 }}
        dataSource={selfies}
        columns={columns}
        size="middle"
        loading={isFetching}
        pagination={false}
      />
    </>
  );
}
