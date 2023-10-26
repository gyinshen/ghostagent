import React from "react";
import ReactMarkdown from "react-markdown";

import { cn } from "@/lib/utils";

type MessageRowProps = {
  speaker: string;
  text: string;
};

export const MessageRow = React.forwardRef(
  (
    { speaker, text, }: MessageRowProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const isUserSpeaker = speaker === "user";
    const containerClasses = cn(
      "py-3 px-5 w-fit ",
      isUserSpeaker
        ? "bg-gray-100 bg-opacity-60 items-start "
        : "bg-purple-100 bg-opacity-60 items-end",
      "dark:bg-gray-800 rounded-3xl flex flex-col overflow-hidden scroll-pb-32"
    );

    const containerWrapperClasses = cn(
      "flex flex-col",

      isUserSpeaker ? "items-end" : "items-start"
    );

    // const markdownClasses = cn("prose", "dark:prose-invert");

    return (
      <div className={containerWrapperClasses}>
        {" "}
        <div ref={ref} className={containerClasses}>
          <div className="w-full gap-1 flex">
          </div>
          <div data-testid="report-message-text">
            {/* <ReactMarkdown className={markdownClasses}>{text}</ReactMarkdown> */}
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }
);

MessageRow.displayName = "MessageRow";
