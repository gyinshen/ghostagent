/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
//frontend/app/report/[reportId]/page.tsx

"use client";


import { ActionsBar } from "./components/ActionsBar";
import { ReportDialogueArea } from "./components/ReportDialogueArea/ReportDialogue";
import { ReportHeader } from "./components/ReportHeader";

const SelectedReportPage = (): JSX.Element => {

  return (
    <main className="flex flex-col w-full pt-10" data-testid="report-page">
      <section className="flex flex-col flex-1 items-center w-full h-full min-h-[70vh]">
        <ReportHeader />
        <div className="flex-1 flex flex-col mt-8 w-full shadow-md dark:shadow-primary/25 hover:shadow-xl transition-shadow rounded-xl overflow-hidden bg-white dark:bg-black border border-black/10 dark:border-white/25 p-12 pt-10 max-h-[80vh]">
          <div className="flex flex-1 flex-col overflow-hidden">
            <ReportDialogueArea />
          </div>
          <ActionsBar />
        </div>
      </section>
    </main>
  );
};

export default SelectedReportPage;
