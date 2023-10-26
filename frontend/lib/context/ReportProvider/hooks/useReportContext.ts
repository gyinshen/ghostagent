import { useContext } from "react";

import { ReportContext } from "../ReportProvider";
import { ReportContextProps } from "../types";

export const useReportContext = (): ReportContextProps => {
  const context = useContext(ReportContext);

  if (context === undefined) {
    throw new Error("useReportContext must be used inside ReportProvider");
  }

  return context;
};
