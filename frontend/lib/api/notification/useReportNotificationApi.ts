import { useAxios } from "@/lib/hooks";

import { getReportNotifications } from "./reportNotification";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useReportNotificationApi = () => {
  const { axiosInstance } = useAxios();

  return {
    getReportNotifications: async (reportId: string) =>
      await getReportNotifications(reportId, axiosInstance),
  };
};
