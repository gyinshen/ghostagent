import { useAxios } from "@/lib/hooks";

import {
  addQuestion,
  AddQuestionParams,
  createReport,
  deleteReport,
  getReportItems,
  getReports,
  ReportUpdatableProperties,
  updateReport,
} from "./report";

// TODO: split './report.ts' into multiple files, per function for example
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useReportApi = () => {
  const { axiosInstance } = useAxios();

  return {
    createReport: async (reportName: string) => createReport(reportName, axiosInstance),
    getReports: async () => getReports(axiosInstance),
    deleteReport: async (reportId: string) => deleteReport(reportId, axiosInstance),
    addQuestion: async (props: AddQuestionParams) =>
      addQuestion(props, axiosInstance),
    getReportItems: async (reportId: string) => getReportItems(reportId, axiosInstance),
    // getReportItemsNoAuth: async (reportId: string) => getReportItemsNoAuth(reportId, axiosInstance),
    updateReport: async (reportId: string, props: ReportUpdatableProperties) =>
      updateReport(reportId, props, axiosInstance),
  };
};
