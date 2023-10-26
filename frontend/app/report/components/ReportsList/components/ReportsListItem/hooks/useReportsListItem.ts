import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from 'react-i18next'

import { ReportEntity } from "@/app/report/[reportId]/types";
import { useReportApi } from "@/lib/api/report/useReportApi";
import { useReportsContext } from "@/lib/context/ReportsProvider/hooks/useReportsContext";
import { useToast } from "@/lib/hooks";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useReportsListItem = (report: ReportEntity) => {
  const pathname = usePathname()?.split("/").at(-1);
  const selected = report.report_id === pathname;
  const [reportName, setReportName] = useState(report.report_name);
  const { publish } = useToast();
  const [editingName, setEditingName] = useState(false);
  const { updateReport, deleteReport } = useReportApi();
  const { setAllReports } = useReportsContext();
  const router = useRouter();
  const { t } = useTranslation(['report']);

  const deleteReportHandler = async () => {
    const reportId = report.report_id;
    try {
      await deleteReport(reportId);
      setAllReports((reports) =>
        reports.filter((currentReport) => currentReport.report_id !== reportId)
      );
      // TODO: Change route only when the current report is being deleted
      void router.push("/report");
      publish({
        text: t('reportDeleted',{ id: reportId, ns:'report'})  ,
        variant: "success",
      });
    } catch (error) {
      console.error(t('errorDeleting',{ error: error, ns:'report'}));
      publish({
        text: t('errorDeleting',{ error: error, ns:'report'}),
        variant: "danger",
      });
    }
  };

  const updateReportName = async () => {
    if (reportName !== report.report_name) {
      await updateReport(report.report_id, { report_name: reportName });
      publish({ 
        text: t('reportNameUpdated', { ns:'report'}), 
        variant: "success" 
      });
    }
  };

  const handleEditNameClick = () => {
    if (editingName) {
      setEditingName(false);
      void updateReportName();
    } else {
      setEditingName(true);
    }
  };

  return {
    setReportName,
    editingName,
    reportName,
    selected,
    handleEditNameClick,
    deleteReport: deleteReportHandler,
  };
};
