import { Flex, Space, Spin } from "antd";

export default function Loading() {
  return (
    <Space
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Flex align="center" gap="middle">
        <Spin size="large" />
      </Flex>
    </Space>
  );
}
