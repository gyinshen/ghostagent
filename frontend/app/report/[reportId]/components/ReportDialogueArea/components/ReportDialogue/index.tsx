import { useTranslation } from "react-i18next";

import { ReportItem } from "./components";
import { useReportDialogue } from "./hooks/useReportDialogue";
import { getKeyFromReportItem } from "./utils/getKeyFromReportItem";
import { ReportItemWithGroupedNotifications } from "../../types";

type MessagesDialogueProps = {
  reportItems: ReportItemWithGroupedNotifications[];
};

export const ReportDialogue = ({
  reportItems,
}: MessagesDialogueProps): JSX.Element => {
  const { t } = useTranslation(["chat"]);
  const { reportListRef } = useReportDialogue();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflowY: "auto",
      }}
      ref={reportListRef}
    >
      {reportItems.length === 0 ? (
        <div
          data-testid="empty-history-message"
          className="text-center opacity-50"
        >
          {t("ask", { ns: "chat" })}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reportItems.map((reportItem) => (
            <ReportItem key={getKeyFromReportItem(reportItem)} content={reportItem} />
          ))}
        </div>
      )}
    </div>
  );
};
