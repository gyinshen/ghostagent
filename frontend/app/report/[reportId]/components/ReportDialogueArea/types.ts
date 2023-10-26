/* eslint-disable sort-imports */
import { ReportMessageItem, Notification } from "../../types";

export type ReportItemWithGroupedNotifications =
  | ReportMessageItem
  | {
      item_type: "NOTIFICATION";
      body: Notification[];
    };
