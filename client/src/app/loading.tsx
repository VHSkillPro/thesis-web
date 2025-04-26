import { Flex, Spin } from "antd";

export default function Loading() {
    return (
        <Flex align="center" gap="middle">
            <Spin size="large" />
        </Flex>
    );
}
