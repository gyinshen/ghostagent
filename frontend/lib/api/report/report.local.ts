import { ReportConfig } from "@/lib/context/ReportProvider/types";

export const saveReportConfigInLocalStorage = (
  reportId: string,
  reportConfig: ReportConfig
): void => {
  localStorage.setItem(`report-config-${reportId}`, JSON.stringify(reportConfig));
};

export const getReportConfigFromLocalStorage = (
  reportId: string
): ReportConfig | undefined => {
  const config = localStorage.getItem(`report-config-${reportId}`);

  if (config === null) {
    return undefined;
  }

  return JSON.parse(config) as ReportConfig;
};
