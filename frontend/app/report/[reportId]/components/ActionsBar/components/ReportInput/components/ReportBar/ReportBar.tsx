"use client";


import { MentionInput } from "./components/MentionInput/MentionInput";


type ReportBarProps = {
  onSubmit: () => void;
  setMessage: (text: string) => void;
  message: string;
  disabled: boolean;
};

export const ReportBar = ({
  onSubmit,
  setMessage,
  message,
  disabled,
}: ReportBarProps): JSX.Element => {
  return (
    <div className="flex flex-row flex-1 w-full item-start">

      <div className="flex-1">
        <MentionInput
          message={message}
          setMessage={setMessage}
          onSubmit={onSubmit}
          disabled={disabled}
        />
      </div>
    </div>
  );
};
