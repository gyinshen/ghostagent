import { useState } from "react";

import { useReport } from "@/app/report/[reportId]/hooks/useReport";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useReportInput = () => {
  const [message, setMessage] = useState<string>("");
  const { addQuestion, generatingAnswer, reportId } = useReport();

  const submitQuestion = () => {
    if (!generatingAnswer) {
      void addQuestion(message, () => setMessage(""));
    }
  };

  return {
    message,
    setMessage,
    submitQuestion,
    generatingAnswer,
    reportId,
  };
};
