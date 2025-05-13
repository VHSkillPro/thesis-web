import { useState } from "react";
import { RcFile } from "antd/es/upload";
import { Button, Row, Spin, Upload } from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import { useNotification } from "@/context/NotificationContext";
import { addSelfieAction } from "@/app/(dashboard)/students/[id]/action";

interface AddStudentSelfieProps {
  id: string;
  onChange: () => void;
}

export default function AddStudentSelfie(props: AddStudentSelfieProps) {
  const { notifyError, notifySuccess } = useNotification();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Validates the uploaded file before it is processed.
   *
   * @param file - The file being uploaded, represented as an `RcFile` object.
   * @returns `Upload.LIST_IGNORE` if the file is invalid (not JPG/PNG or exceeds size limit),
   *          otherwise returns `false` to allow further processing.
   *
   * Validation criteria:
   * - The file must be of type JPG or PNG. If not, an error notification is displayed.
   * - The file size must be less than 10MB. If it exceeds this limit, an error notification is displayed.
   *
   * Notifications:
   * - Displays an error message if the file type is invalid: "Bạn chỉ có thể tải lên ảnh JPG/PNG".
   * - Displays an error message if the file size exceeds the limit: "Kích thước ảnh phải nhỏ hơn 10MB".
   */
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      notifyError("Bạn chỉ có thể tải lên ảnh JPG/PNG");
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      notifyError("Kích thước ảnh phải nhỏ hơn 10MB");
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const onUpload = async (files: RcFile[]) => {
    setIsLoading(true);

    if (files.length === 0) {
      return;
    }

    const response = await addSelfieAction(props.id, files[0]);
    if (response.success) {
      notifySuccess("Cập nhật thẻ sinh viên thành công");
      props.onChange();
    } else {
      notifyError(response.message);
    }

    setIsLoading(false);
  };

  return (
    <Row>
      <Upload
        beforeUpload={beforeUpload}
        showUploadList={false}
        onChange={(file) => onUpload(file.fileList as RcFile[])}
        maxCount={1}
      >
        <Button variant="filled" disabled={isLoading}>
          <FileAddOutlined />
          Thêm ảnh chân dung
        </Button>
        {isLoading && <Spin size="small" style={{ marginLeft: 10 }} />}
      </Upload>
    </Row>
  );
}
