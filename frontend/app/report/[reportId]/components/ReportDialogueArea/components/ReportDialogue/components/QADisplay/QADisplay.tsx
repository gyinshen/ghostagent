import { ReportMessage } from "@/app/report/[reportId]/types";

import { MessageRow } from "./components";

type QADisplayProps = {
  content: ReportMessage;
};
export const QADisplay = ({ content }: QADisplayProps): JSX.Element => {
  const { assistant, message_id } =
    content;

  return (
    <>
      {/* <MessageRow
        key={`user-${message_id}`}
        speaker={"user"}
        text={user_message}
      /> */}
      <MessageRow
        key={`assistant-${message_id}`}
        speaker={"assistant"}
        text={assistant}
      />
    </>
  );
};
