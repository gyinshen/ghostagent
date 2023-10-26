import Link from "next/link";
import { FiEdit, FiSave, FiTrash2 } from "react-icons/fi";
import { MdChatBubbleOutline } from "react-icons/md";

import { ReportEntity } from "@/app/report/[reportId]/types";
import { cn } from "@/lib/utils";

import { ReportName } from "./components/ReportName";
import { useReportsListItem } from "./hooks/useReportsListItem";

interface ReportsListItemProps {
  report: ReportEntity;
}

export const ReportsListItem = ({ report }: ReportsListItemProps): JSX.Element => {
  const {
    setReportName,
    deleteReport,
    handleEditNameClick,
    selected,
    reportName,
    editingName,
  } = useReportsListItem(report);

  return (
    <div
      className={cn(
        "w-full border-b border-black/10 dark:border-white/25 last:border-none relative group flex overflow-x-hidden hover:bg-gray-100 dark:hover:bg-gray-800",
        selected
          ? "bg-gray-100 dark:bg-gray-800 text-primary dark:text-white"
          : ""
      )}
      data-testid="reports-list-item"
    >
      <Link
        className="flex flex-col flex-1 min-w-0 p-4"
        href={`/report/${report.report_id}`}
        key={report.report_id}
      >
        <div className="flex items-center gap-2">
          <MdChatBubbleOutline className="text-xl" />
          <ReportName
            setName={setReportName}
            editing={editingName}
            name={reportName}
          />
        </div>
      </Link>
      <div className="opacity-0 group-hover:opacity-100 flex items-center justify-center bg-gradient-to-l from-white dark:from-black to-transparent z-10 transition-opacity">
        <button
          className="p-0 hover:text-blue-700"
          type="button"
          onClick={handleEditNameClick}
        >
          {editingName ? <FiSave /> : <FiEdit />}
        </button>
        <button
          className="p-5 hover:text-red-700"
          type="button"
          onClick={() => void deleteReport()}
        >
          <FiTrash2 />
        </button>
      </div>

      {/* Fade to white */}
      <div
        aria-hidden
        className="not-sr-only absolute left-1/2 top-0 bottom-0 right-0 bg-gradient-to-r from-transparent to-white dark:to-black pointer-events-none"
      ></div>
    </div>
  );
};
