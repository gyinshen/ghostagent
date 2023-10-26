import { Notification, ReportMessage } from "@/app/report/[reportId]/types";

import { Model } from "../../types/Config";

export type ReportConfig = {
  model?: Model;
  temperature?: number;
  maxTokens?: number;
};

export type ReportContextProps = {
  messages: ReportMessage[];
  setMessages: (history: ReportMessage[]) => void;
  addToHistory: (message: ReportMessage) => void;
  updateHistory: (report: ReportMessage) => void;
  updateStreamingHistory: (streamedReport: ReportMessage) => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
};
