"use client";
import AppBreadcrumb from "@/components/AppBreadcrumb";
import MyHeader from "@/components/Header";
import MySider from "@/components/Sider";
import { useAuth } from "@/context/AuthContext";
import { Layout, Row, theme } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../loading";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if (pathname === "/lecturers" && user?.roleId !== "admin") {
      router.push("/404");
    } else {
      setIsLoading(false);
    }
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Layout>
      <MySider collapsed={collapsed}></MySider>
      <Layout>
        <MyHeader collapsed={collapsed} setCollapsed={setCollapsed}></MyHeader>
        <Row style={{ marginLeft: 16 }}>
          <AppBreadcrumb />
        </Row>
        <Content
          style={{
            marginLeft: 16,
            marginRight: 16,
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ngô Văn Hải © {new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
}
