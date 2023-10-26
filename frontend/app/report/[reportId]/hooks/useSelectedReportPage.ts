/* eslint-disable import/order */
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import { useReportApi } from "@/lib/api/report/useReportApi";
import { useReportNotificationApi } from "@/lib/api/notification/useReportNotificationApi";
import { useReportContext } from "@/lib/context";

import { getReportNotificationsQueryKey } from "../utils/getReportNotificationsQueryKey";
import { getMessagesFromReportItems } from "../utils/getMessagesFromReportItems";
import { getNotificationsFromReportItems } from "../utils/getNotificationsFromReportItems";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useSelectedReportPage = () => {
  const { setMessages, setNotifications, notifications } = useReportContext();
  const { getReportItems } = useReportApi();
  const { getReportNotifications } = useReportNotificationApi();
  const params = useParams();

  const reportId = params?.reportId as string | undefined;

  const reportNotificationsQueryKey = getReportNotificationsQueryKey(reportId ?? "");
  const { data: fetchedNotifications = [] } = useQuery({
    queryKey: [reportNotificationsQueryKey],
    enabled: notifications.length > 0,
    queryFn: () => {
      if (reportId === undefined) {
        return [];
      }

      return getReportNotifications(reportId);
    },
    refetchInterval: () => {
      if (notifications.length === 0) {
        return false;
      }
      const hasAPendingNotification = notifications.find(
        (item) => item.status === "Pending"
      );

      if (hasAPendingNotification) {
        //30 seconds
        return 30_000;
      }

      return false;
    },
  });

  useEffect(() => {
    if (fetchedNotifications.length === 0) {
      return;
    }
    setNotifications(fetchedNotifications);
  }, [fetchedNotifications]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (reportId === undefined) {
        setMessages([]);
        setNotifications([]);

        return;
      }

      const reportItems = await getReportItems(reportId);

      setMessages(getMessagesFromReportItems(reportItems));
      setNotifications(getNotificationsFromReportItems(reportItems));
    };
    void fetchHistory();
  }, [reportId]);
};
