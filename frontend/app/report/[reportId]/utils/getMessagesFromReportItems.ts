import { ReportItem, ReportMessage } from "../types";

export const getMessagesFromReportItems = (
  reportItems: ReportItem[]
): ReportMessage[] => {
  const messages = reportItems
    .filter((item) => item.item_type === "MESSAGE")
    .map((item) => item.body as ReportMessage);

  return messages;
};
