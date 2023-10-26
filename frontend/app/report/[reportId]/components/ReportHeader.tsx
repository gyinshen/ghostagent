import { useTranslation } from "react-i18next";

import { useReportContext } from "@/lib/context";

export const ReportHeader = (): JSX.Element => {
  const { t } = useTranslation(["report"]);
  const { messages } = useReportContext();

  if (messages.length !== 0) {
    return (
      <h1 className="text-3xl font-bold text-center">
        {t("report_title_intro")}{" "}
      </h1>
    );
  }

  return (
    <h1 className="text-3xl font-bold text-center">
      {t("new_report")}{" "}
    </h1>
  );
};
