"use client";

import { createContext, useState } from "react";

import { Notification, ReportMessage } from "@/app/report/[reportId]/types";

import { ReportContextProps } from "./types";

export const ReportContext = createContext<ReportContextProps | undefined>(
  undefined
);

export const ReportProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element => {
  const [messages, setMessages] = useState<ReportMessage[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addToHistory = (message: ReportMessage) => {
    setMessages((prevHistory) => [...prevHistory, message]);
  };

  const updateStreamingHistory = (streamedReport: ReportMessage): void => {
    setMessages((prevHistory: ReportMessage[]) => {
      const updatedHistory = prevHistory.find(
        (item) => item.message_id === streamedReport.message_id
      )
        ? prevHistory.map((item: ReportMessage) =>
            item.message_id === streamedReport.message_id
              ? { ...item, assistant: item.assistant + streamedReport.assistant }
              : item
          )
        : [...prevHistory, streamedReport];

      return updatedHistory;
    });
  };

  const updateHistory = (report: ReportMessage): void => {
    setMessages((prevHistory: ReportMessage[]) => {
      const updatedHistory = prevHistory.find(
        (item) => item.message_id === report.message_id
      )
        ? prevHistory.map((item: ReportMessage) =>
            item.message_id === report.message_id
              ? { ...item, assistant: report.assistant }
              : item
          )
        : [...prevHistory, report];

      return updatedHistory;
    });
  };

  return (
    <ReportContext.Provider
      value={{
        messages,
        setMessages,
        addToHistory,
        updateHistory,
        updateStreamingHistory,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};
