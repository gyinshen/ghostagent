/* eslint-disable max-lines */
import axios from "axios";
import { useTranslation } from "react-i18next";


import { useReportContext } from "@/lib/context/ReportProvider/hooks/useReportContext";
import { useFetch, useToast } from "@/lib/hooks";

import { ReportMessage, ReportQuestion } from "../types";

interface UseReportService {
  addStreamQuestion: (
    reportId: string,
    reportQuestion: ReportQuestion
  ) => Promise<void>;
}

export const useQuestion = (): UseReportService => {
  const { fetchInstance } = useFetch();
  const { updateStreamingHistory } = useReportContext();

  const { t } = useTranslation(["report"]);
  const { publish } = useToast();
  const handleStream = async (
    reader: ReadableStreamDefaultReader<Uint8Array>
  ): Promise<void> => {
    const decoder = new TextDecoder("utf-8");

    const handleStreamRecursively = async () => {
      const { done, value } = await reader.read();

      if (done) {
        return;
      }

      const dataStrings = decoder
        .decode(value)
        .trim()
        .split("data: ")
        .filter(Boolean);

      dataStrings.forEach((data) => {
        try {
          const parsedData = JSON.parse(data) as ReportMessage;
          updateStreamingHistory(parsedData);
        } catch (error) {
          console.error(t("errorParsingData", { ns: "report" }), error);
        }
      });

      await handleStreamRecursively();
    };

    await handleStreamRecursively();
  };



  const addStreamQuestion = async (
    reportId: string,
    reportQuestion: ReportQuestion
  ): Promise<void> => {
    const headers = {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    };
    const body = JSON.stringify(reportQuestion);
    console.log("Calling API...");
    try {
      const response = await fetchInstance.post(
        `/report/${reportId}/question/stream`,
        body,
        headers
      );

      if (response.body === null) {
        throw new Error(t("resposeBodyNull", { ns: "report" }));
      }

      console.log(t("receivedResponse"), response);
      await handleStream(response.body.getReader());
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        publish({
          variant: "danger",
          text: t("tooManyRequests", { ns: "report" }),
        });
      }

      console.error(t("errorCallingAPI", { ns: "report" }), error);
    }
  };


  return {
    addStreamQuestion,

  };
};