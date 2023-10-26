import { useContext } from "react";

import { ReportsContext } from "../reports-provider";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useReportsContext = () => {
  const context = useContext(ReportsContext);

  if (context === undefined) {
    throw new Error("useReportsStore must be used inside ReportsProvider");
  }

  return context;
};
