import { Result } from "antd";

export default function Page() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Result
        status="500" // Antd tự động hiển thị icon và style phù hợp cho status 500
        title="500"
        subTitle="Xin lỗi, đã có lỗi xảy ra phía máy chủ."
      />
    </div>
  );
}
