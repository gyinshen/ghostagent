import { Notification, ReportItem } from "../types";

export const getNotificationsFromReportItems = (
  reportItems: ReportItem[]
): Notification[] => {
  const messages = reportItems
    .filter((item) => item.item_type === "NOTIFICATION")
    .map((item) => item.body as Notification);

  return messages;
};
