import { AxiosInstance } from "axios";

import { Notification } from "@/app/report/[reportId]/types";

export const getReportNotifications = async (
  reportId: string,
  axiosInstance: AxiosInstance
): Promise<Notification[]> => {
  return (await axiosInstance.get<Notification[]>(`/notifications/${reportId}`))
    .data;
};
