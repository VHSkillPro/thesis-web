"use client";
import { useEffect, useState } from "react";
import { Breadcrumb, Space } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";

const breadcrumbNameMap: { [key: string]: string } = {
  "/": "Trang chủ",
  "/students": "Sinh viên",
  "/lecturers": "Giảng viên",
  "/classes": "Lớp học",
  "/create": "Thêm",
  "/profile": "Thông tin cá nhân",
};

const generateBreadcrumbName = (segment: string): string => {
  if (breadcrumbNameMap[`/${segment}`]) {
    return breadcrumbNameMap[`/${segment}`];
  }

  if (segment.match(/^[0-9a-zA-Z]+$/) || !isNaN(Number(segment))) {
    return `Chi tiết ${segment}`;
  }

  try {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  } catch (error) {
    return segment;
  }
};

export default function AppBreadcrumb() {
  const pathname = usePathname();
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItemType[]>(
    []
  );

  useEffect(() => {
    if (!pathname) return;

    const pathSegments = pathname.split("/").filter((segment) => segment);

    const items: BreadcrumbItemType[] = [
      {
        title: <Link href="/">Trang chủ</Link>,
      },
    ];

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      const displayName = generateBreadcrumbName(segment);

      items.push({
        key: currentPath,
        title: isLast ? (
          <span>{displayName}</span>
        ) : (
          <Link href={currentPath}>{displayName}</Link>
        ),
      });
    });

    setBreadcrumbItems(items);
  }, [pathname]);

  return (
    <Breadcrumb
      style={{ margin: "16px 0" }}
      items={breadcrumbItems}
    ></Breadcrumb>
  );
}
