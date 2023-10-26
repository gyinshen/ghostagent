/* eslint-disable import/order */
"use client";
import { motion, MotionConfig } from "framer-motion";
import { MdChevronRight } from "react-icons/md";

import { useReportsContext } from "@/lib/context/ReportsProvider/hooks/useReportsContext";
import { cn } from "@/lib/utils";

import { ReportsListItem } from "./components/ReportsListItem";
import { MiniFooter } from "./components/ReportsListItem/components/MiniFooter";
import { NewReportButton } from "./components/NewReportButton";
import { useReportsList } from "./hooks/useReportsList";
import { useSelectedReportPage } from "../../[reportId]/hooks/useSelectedReportPage";

export const ReportsList = (): JSX.Element => {
  const { allReports } = useReportsContext();
  const { open, setOpen } = useReportsList();
  useSelectedReportPage();

  return (
    <MotionConfig transition={{ mass: 1, damping: 10 }}>
      <motion.div
        drag="x"
        dragConstraints={{ right: 0, left: 0 }}
        dragElastic={0.15}
        onDragEnd={(event, info) => {
          if (info.offset.x > 100 && !open) {
            setOpen(true);
          } else if (info.offset.x < -100 && open) {
            setOpen(false);
          }
        }}
        className="flex flex-col lg:sticky fixed top-16 left-0 bottom-0 lg:h-[90vh] overflow-visible z-30 border-r border-black/10 dark:border-white/25 bg-white dark:bg-black"
      >
        <motion.div
          animate={{
            width: open ? "fit-content" : "0px",
            opacity: open ? 1 : 0.5,
            boxShadow: open
              ? "10px 10px 16px rgba(0, 0, 0, 0)"
              : "10px 10px 16px rgba(0, 0, 0, 0.5)",
          }}
          className={cn("overflow-hidden flex flex-col flex-1")}
          data-testid="reports-list"
        >
          <div className="flex flex-col flex-1 h-full">
            <NewReportButton />
            <div
              data-testid="reports-list-items"
              className="flex-1 overflow-auto scrollbar h-full"
            >
              {allReports.map((report) => (
                <ReportsListItem key={report.report_id} report={report} />
              ))}
            </div>
            <MiniFooter />
          </div>
        </motion.div>
        <button
          onClick={() => {
            setOpen(!open);
          }}
          className="absolute left-full top-16 text-3xl bg-black dark:bg-white text-white dark:text-black rounded-r-full p-3 pl-1"
          data-testid="reports-list-toggle"
        >
          <motion.div
            whileTap={{ scale: 0.9 }}
            animate={{ scaleX: open ? -1 : 1 }}
          >
            <MdChevronRight />
          </motion.div>
        </button>
      </motion.div>
    </MotionConfig>
  );
};
