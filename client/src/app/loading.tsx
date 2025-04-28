import { Flex, Space, Spin } from "antd";

export default function Loading() {
    return (
        <Space
            style={{
                height: "100vh",
                width: "100vw",
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
