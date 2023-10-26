import { useReportContext } from "@/lib/context";

import { ReportDialogue } from "./components/ReportDialogue";
import { ShortCuts } from "./components/ShortCuts";
import { getMergedReportMessagesWithDoneStatusNotificationsReduced } from "./utils/getMergedReportMessagesWithDoneStatusNotificationsReduced";

export const ReportDialogueArea = (): JSX.Element => {
  const { messages, notifications } = useReportContext();

  const reportItems = getMergedReportMessagesWithDoneStatusNotificationsReduced(
    messages,
    notifications
  );

  const shouldDisplayShortcuts = reportItems.length === 0;

  if (!shouldDisplayShortcuts) {
    return <ReportDialogue reportItems={reportItems} />;
  }

  return <ShortCuts />;
};
