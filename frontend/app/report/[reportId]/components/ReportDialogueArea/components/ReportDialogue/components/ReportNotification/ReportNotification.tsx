import { Notification } from "@/app/report/[reportId]/types";

import { NotificationDisplayer } from "./components";

type NotificationProps = {
  content: Notification[];
};

export const ReportNotification = ({
  content,
}: NotificationProps): JSX.Element => {
  return (
    <div className="flex flex-col flex-1 p-3 rounded-xl bg-blue-50 max-w-[50%]">
      {content.map((notification) => (
        <NotificationDisplayer key={notification.id} content={notification} />
      ))}
    </div>
  );
};
