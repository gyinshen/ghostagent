/* eslint-disable */
"use client";

import { createContext, useState } from "react";

import { ReportEntity } from "@/app/report/[reportId]/types";

type ReportsContextType = {
  allReports: ReportEntity[];
  //set setAllReports is from the useState hook so it can take a function as params
  setAllReports: React.Dispatch<React.SetStateAction<ReportEntity[]>>;
};

export const ReportsContext = createContext<ReportsContextType | undefined>(
  undefined
);

export const ReportsProvider = ({ children }: { children: React.ReactNode }) => {
  const [allReports, setAllReports] = useState<ReportEntity[]>([]);

  return (
    <ReportsContext.Provider
      value={{
        allReports,
        setAllReports,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
};
