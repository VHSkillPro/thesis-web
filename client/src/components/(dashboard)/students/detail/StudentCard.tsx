"use client";
import { useState } from "react";
import { RcFile } from "antd/es/upload";
import { Button, Image, Row, Space, Spin, Typography, Upload } from "antd";
import { useNotification } from "@/context/NotificationContext";
import { updateStudentAction } from "@/app/(dashboard)/students/[id]/action";

interface StudentCardProps {
  id: string;
  cardUri?: string;
  afterUpload: () => void;
}

export default function StudentCard(props: StudentCardProps) {
  const { notifySuccess, notifyError } = useNotification();
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

  /**
   * Handles the upload of a student's card file.
   *
   * @param files - An array of `RcFile` objects representing the files to be uploaded.
   *
   * @remarks
   * - This function sets a loading state while the upload is in progress.
   * - If no files are provided, the function exits early.
   * - Sends the first file in the array to the `updateStudentAction` API.
   * - On successful upload, triggers the `afterUpload` callback and displays a success notification.
   * - On failure, displays an error notification with the provided message.
   * - Resets the loading state after the process completes.
   */
  const onUpload = async (files: RcFile[]) => {
    setIsLoading(true);

    if (files.length === 0) {
      return;
    }

    const response = await updateStudentAction(props.id, {
      card: files[0],
    });

    if (response.success) {
      props.afterUpload();
      notifySuccess("Cập nhật thẻ sinh viên thành công");
    } else {
      notifyError(response.message);
    }

    setIsLoading(false);
  };

  return (
    <>
      <Row justify={"space-between"} align="top">
        <Typography.Title level={5}>Thẻ sinh viên</Typography.Title>
        <Upload
          beforeUpload={beforeUpload}
          showUploadList={false}
          onChange={(file) => onUpload(file.fileList as RcFile[])}
          maxCount={1}
        >
          <Button variant="filled" size="small">
            Tải ảnh thẻ sinh viên
          </Button>
        </Upload>
      </Row>
      {isLoading ? (
        <Space
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin></Spin>
        </Space>
      ) : (
        <Image src={props.cardUri}></Image>
      )}
      <Typography.Text type="warning">
        Lưu ý: Cập nhật thẻ sinh viên sẽ xóa hết các ảnh chân dung hiện tại
      </Typography.Text>
    </>
  );
}
