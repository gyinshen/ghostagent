import { ReportItemWithGroupedNotifications } from "../../../types";

export const getKeyFromReportItem = (
  reportItem: ReportItemWithGroupedNotifications
): string => {
  if (reportItem.item_type === "MESSAGE") {
    return reportItem.body.message_id;
  } else {
    return reportItem.body[0].id;
  }
};
