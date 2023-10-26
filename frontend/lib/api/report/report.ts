/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable max-lines */
import { AxiosError, AxiosInstance, } from "axios";



import {
  ReportEntity,
  ReportItem,
  ReportMessage,
  ReportQuestion,
} from "@/app/report/[reportId]/types";

export const createReport = async (
  name: string,
  axiosInstance: AxiosInstance
): Promise<ReportEntity> => {
  const createdReport = (
    await axiosInstance.post<ReportEntity>("/report", { name: name })
  ).data;

  return createdReport;
};

// export const getReports = async (
//   axiosInstance: AxiosInstance
// ): Promise<ReportEntity[]> => {
//   try {
//     const response = await axiosInstance.get<{
//       reports: ReportEntity[];
//     }>(`/report`);

//     console.log('getReports response:', response);

//     return response.data.reports;
//   } catch (error) {
//     console.log('getReports error:', error);
//     throw error;
//   }
// };


export const getReports = async (
  axiosInstance: AxiosInstance
): Promise<ReportEntity[]> => {
  try {
    const response = await axiosInstance.get<{
      reports: ReportEntity[];
    }>(`/report`);

    console.log('getReports response:', response);

    return response.data.reports;
  } catch (error) {
    const axiosError = error as AxiosError;

    console.log('getReports error:', axiosError);

    if (axiosError.response) {
      console.log('Error response:', {
        data: axiosError.response.data,
        status: axiosError.response.status,
        headers: axiosError.response.headers,
      });
    } else if (axiosError.request) {
      console.log('Error request:', axiosError.request);
    } else {
      console.log('Error message:', axiosError.message);
    }

    console.log('Error config:', axiosError.config);

    throw axiosError;
  }
};

export const deleteReport = async (
  reportId: string,
  axiosInstance: AxiosInstance
): Promise<void> => {
  await axiosInstance.delete(`/report/${reportId}`);
};

export type AddQuestionParams = {
  reportId: string;
  reportQuestion: ReportQuestion;
};

export const addQuestion = async (
  { reportId, reportQuestion }: AddQuestionParams,
  axiosInstance: AxiosInstance
): Promise<ReportMessage> => {
  const response = await axiosInstance.post<ReportMessage>(
    `/report/${reportId}/question`,
    reportQuestion
  );

  return response.data;
};

export const addQuestionHuman = async (
  { reportId, reportQuestion, }: AddQuestionParams,
  axiosInstance: AxiosInstance
): Promise<ReportMessage> => {
  const response = await axiosInstance.post<ReportMessage>(
    `/report/${reportId}/question_human`,
    reportQuestion
  );

  return response.data;
};

export const getReportItems = async (
  reportId: string,
  axiosInstance: AxiosInstance
): Promise<ReportItem[]> => {
  try {
    const response = await axiosInstance.get<ReportItem[]>(`/report/${reportId}/history`);
    
    console.log('getReportItems response:', response);
    
    return response.data;
  } catch (error) {
    console.log('getReportItems error:', error);
    throw error;
  }
};


export type ReportUpdatableProperties = {
  report_name?: string;
};
export const updateReport = async (
  reportId: string,
  report: ReportUpdatableProperties,
  axiosInstance: AxiosInstance
): Promise<ReportEntity> => {
  return (await axiosInstance.put<ReportEntity>(`/report/${reportId}/metadata`, report))
    .data;
};
