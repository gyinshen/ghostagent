/* eslint-disable max-lines */
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { getReportConfigFromLocalStorage } from "@/lib/api/report/report.local";
import { useReportApi } from "@/lib/api/report/useReportApi";
import { useReportContext } from "@/lib/context";
import { useToast } from "@/lib/hooks";
import { useEventTracking } from "@/services/analytics/useEventTracking";

import { useQuestion } from "./useQuestion";
import { ReportQuestion } from "../types";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useReport = () => {
  const { track } = useEventTracking();

  const params = useParams();
  const [reportId, setReportId] = useState<string | undefined>(
    params?.reportId as string | undefined
  );
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const router = useRouter();
  const { messages } = useReportContext();
  const { publish } = useToast();
  const { createReport } = useReportApi();

  const { addStreamQuestion } = useQuestion();
  const { t } = useTranslation(["report"]);

  const addQuestion = async (question: string, callback?: () => void) => {
    if (question === "") {
      publish({
        variant: "danger",
        text: t("ask"),
      });

      return;
    }

    try {
      setGeneratingAnswer(true);

      let currentReportId = reportId;

      let shouldUpdateUrl = false;

      //if reportId is not set, create a new report. Report name is from the first question
      if (currentReportId === undefined) {
        const reportName = question.split(" ").slice(0, 3).join(" ");
        const report = await createReport(reportName);
        currentReportId = report.report_id;
        setReportId(currentReportId);
        shouldUpdateUrl = true;
        //TODO: update report list here
      }

      void track("QUESTION_ASKED");

      const reportConfig = getReportConfigFromLocalStorage(currentReportId);

      const reportQuestion: ReportQuestion = {
        model: reportConfig?.model,
        question,
        temperature: reportConfig?.temperature,
        max_tokens: reportConfig?.maxTokens,
      };

      await addStreamQuestion(currentReportId, reportQuestion);

      callback?.();

      if (shouldUpdateUrl) {
        router.replace(`/report/${currentReportId}`);
      }
    } catch (error) {
      console.error({ error });

      if ((error as AxiosError).response?.status === 429) {
        publish({
          variant: "danger",
          text: t("limit_reached", { ns: "report" }),
        });

        return;
      }

      publish({
        variant: "danger",
        text: t("error_occurred", { ns: "report" }),
      });
    } finally {
      setGeneratingAnswer(false);
    }
  };




  return {
    messages,
    addQuestion,
    generatingAnswer,
    reportId,
    // handleUserConfirmation
  };
};
