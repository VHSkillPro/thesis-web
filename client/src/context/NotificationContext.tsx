"use client";

import { message } from "antd";
import React, { createContext, useContext, ReactNode } from "react";
import type { MessageInstance } from "antd/es/message/interface";

interface NotificationContextType {
    notifySuccess: (content: string) => void;
    notifyError: (content: string) => void;
    notifyInfo: (content: string) => void;
    notifyWarning: (content: string) => void;
}

// Tạo Context với giá trị mặc định là null (sẽ được cung cấp bởi Provider)
const NotificationContext = createContext<NotificationContextType | null>(null);

// Tạo Provider Component
interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
    children,
}) => {
    const [messageApi, contextHolder] = message.useMessage();

    const notifySuccess = (content: string) => {
        messageApi.success(content);
    };

    const notifyError = (content: string) => {
        messageApi.error(content);
    };

    const notifyInfo = (content: string) => {
        messageApi.info(content);
    };

    const notifyWarning = (content: string) => {
        messageApi.warning(content);
    };

    const contextValue: NotificationContextType = {
        notifySuccess,
        notifyError,
        notifyInfo,
        notifyWarning,
    };

    return (
        <NotificationContext.Provider value={contextValue}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error(
            "useNotification must be used within a NotificationProvider"
        );
    }
    return context;
};
