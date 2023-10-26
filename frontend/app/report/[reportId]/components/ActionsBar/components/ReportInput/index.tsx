/* eslint-disable import/order */
/* eslint-disable max-lines */
"use client";
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import Button from "@/lib/components/ui/Button";
import { ReportBar } from "./components/ReportBar/ReportBar";
import { useReportContext } from "@/lib/context";

import { useReportInput } from "./hooks/useReportInput";

export const ReportInput = (): JSX.Element => {
  const { setMessage, submitQuestion, generatingAnswer, message } =
    useReportInput();
  const { t } = useTranslation(["report"]);
  const { messages } = useReportContext();
  
  const [timer, setTimer] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (generatingAnswer) {
      // Start timer
      const id = setInterval(() => {
        setTimer(s => s + 1);
      }, 1000);
      setIntervalId(id);
    } else {
      // Stop timer
      if (intervalId) {
        clearInterval(intervalId);
      }
      setIntervalId(null);
    }

    // Reset timer when done
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [generatingAnswer]);

  return (
    <form
      data-testid="report-input-form"
      onSubmit={(e) => {
        e.preventDefault();
        submitQuestion();
      }}
      className="sticky flex items-star bottom-0 bg-white dark:bg-black w-full flex justify-center gap-2 z-20"
    >

      <div className="flex flex-1 flex-col items-center">
        <ReportBar
          message={message}
          setMessage={setMessage}
          onSubmit={submitQuestion}
          disabled={messages.length !== 0}
        />
      </div>
      <div className="flex flex-row items-end">
          <>
            <Button
              className="px-3 py-2 sm:px-4 sm:py-2"
              type="submit"
              isLoading={generatingAnswer}
              data-testid="submit-button"
              disabled={messages.length !== 0}
            >
              {generatingAnswer
                ? t("thinking", { ns: "report" })
                : t("research", { ns: "report" })}
            </Button>
            <div className="flex items-center">
              {generatingAnswer && <div>{formatTime(timer)}</div>}
            </div>
          </>
      </div>
    </form>
  );
};