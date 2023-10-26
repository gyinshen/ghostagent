/* eslint-disable import/order */
import { QADisplay } from "../QADisplay";
import { ReportNotification } from "../ReportNotification/ReportNotification";
import { ReportItemWithGroupedNotifications } from "../../../../types";


type ReportItemProps = {
  content: ReportItemWithGroupedNotifications;
};
export const ReportItem = ({ content }: ReportItemProps): JSX.Element => {
  if (content.item_type === "MESSAGE") {
    return <QADisplay content={content.body} />;
  }

  return <ReportNotification content={content.body} />;
};
