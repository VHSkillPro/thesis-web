"use client";

import React, { useEffect, useState } from "react";
import { Breadcrumb } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

const breadcrumbNameMap: { [key: string]: string } = {
  "/": "Trang chủ",
  "/students": "Sinh viên",
  "/create": "Thêm",
};

const generateBreadcrumbName = (segment: string): string => {
  if (breadcrumbNameMap[`/${segment}`]) {
    return breadcrumbNameMap[`/${segment}`];
  }
  if (segment.match(/^[0-9a-fA-F]{24}$/) || !isNaN(Number(segment))) {
    return `Chi tiết (${segment.substring(0, 6)}...)`;
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

const AppBreadcrumb: React.FC = () => {
  const pathname = usePathname();
  const [breadcrumbItems, setBreadcrumbItems] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    if (!pathname) return;

    const pathSegments = pathname.split("/").filter((segment) => segment);

    const items: React.ReactNode[] = [
      <Breadcrumb.Item key="home">
        <Link href="/">Trang chủ</Link>
      </Breadcrumb.Item>,
    ];

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      const displayName = generateBreadcrumbName(segment);

      items.push(
        <Breadcrumb.Item key={currentPath}>
          {isLast ? (
            <span>{displayName}</span>
          ) : (
            <Link href={currentPath}>{displayName}</Link>
          )}
        </Breadcrumb.Item>
      );
    });

    setBreadcrumbItems(items);
  }, [pathname]);

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <Breadcrumb style={{ margin: "16px 0" }}>{breadcrumbItems}</Breadcrumb>
  );
};

export default AppBreadcrumb;
