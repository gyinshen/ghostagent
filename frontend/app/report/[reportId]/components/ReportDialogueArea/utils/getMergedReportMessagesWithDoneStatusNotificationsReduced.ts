import {
  Notification,
  NotificationItem,
  ReportItem,
  ReportMessage,
  ReportMessageItem,
  
} from "../../../types";
import { ReportItemWithGroupedNotifications } from "../types";

// Function to create a ReportMessageItem from a message
const createReportMessageItem = (message: ReportMessage): ReportMessageItem => ({
  item_type: "MESSAGE",
  body: message,
});

// Function to create a NotificationItem from a notification
const createNotificationItem = (
  notification: Notification
): NotificationItem => ({
  item_type: "NOTIFICATION",
  body: notification,
});

// Function to merge report messages and notifications into a single array
const mergeReportMessagesAndNotifications = (
  messages: ReportMessage[],
  notifications: Notification[]
): ReportItem[] => [
  ...messages.map(createReportMessageItem),
  ...notifications.map(createNotificationItem),
];

// Function to compare two items by timestamp (message_time or datetime)
const compareItemsByTimestamp = (a: ReportItem, b: ReportItem): number => {
  const timestampA =
    a.item_type === "MESSAGE" ? a.body.message_time : a.body.datetime;
  const timestampB =
    b.item_type === "MESSAGE" ? b.body.message_time : b.body.datetime;

  return Date.parse(timestampA) - Date.parse(timestampB);
};

// Main function to get merged report messages with reduced notifications using reduce
export const getMergedReportMessagesWithDoneStatusNotificationsReduced = (
  messages: ReportMessage[],
  notifications: Notification[]
): ReportItemWithGroupedNotifications[] => {
  const mergedReportItems = mergeReportMessagesAndNotifications(
    messages,
    notifications.filter((notification) => notification.status === "Done")
  );
  mergedReportItems.sort(compareItemsByTimestamp);

  // Group notifications between messages
  const groupedReportItemsByNotifications = mergedReportItems.reduce(
    (result, item) => {
      if (item.item_type === "MESSAGE") {
        result.push(item);
      } else {
        const lastItem = result[result.length - 1];
        if (lastItem !== undefined && lastItem.item_type === "NOTIFICATION") {
          lastItem.body.push(item.body);
        } else {
          result.push({
            item_type: "NOTIFICATION",
            body: [item.body],
          });
        }
      }

      return result;
    },
    [] as ReportItemWithGroupedNotifications[]
  );

  return groupedReportItemsByNotifications;
};
