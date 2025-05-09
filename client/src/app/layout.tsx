import "@ant-design/v5-patch-for-react-19";
import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { NotificationProvider } from "@/context/NotificationContext";
import { Suspense } from "react";
import Loading from "./loading";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "MSAA",
  description: "Hệ thống quản lý dữ liệu điểm danh tự động",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <AntdRegistry>
          <NotificationProvider>
            <AuthProvider>
              <Suspense fallback={<Loading />}>{children}</Suspense>
            </AuthProvider>
          </NotificationProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
