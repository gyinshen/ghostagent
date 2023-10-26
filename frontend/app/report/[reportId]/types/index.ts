import { UUID } from "crypto";

export type ReportQuestion = {
  model?: string;
  question?: string;
  temperature?: number;
  max_tokens?: number;
};
export type ReportMessage = {
  report_id: string;
  message_id: string;
  user_message: string;
  assistant: string;
  message_time: string;
  search_queries?: string;
  status?: string;
};

type NotificationStatus = "Pending" | "Done";

export type Notification = {
  id: string;
  datetime: string;
  report_id?: string | null;
  message?: string | null;
  action: string;
  status: NotificationStatus;
};

export type ReportMessageItem = {
  item_type: "MESSAGE";
  body: ReportMessage;
};

export type NotificationItem = {
  item_type: "NOTIFICATION";
  body: Notification;
};

export type ReportItem = ReportMessageItem | NotificationItem;

export type ReportEntity = {
  report_id: UUID;
  user_id: string;
  creation_time: string;
  report_name: string;
};
