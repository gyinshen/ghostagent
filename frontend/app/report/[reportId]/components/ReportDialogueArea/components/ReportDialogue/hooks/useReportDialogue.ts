import _debounce from "lodash/debounce";
import { useCallback, useEffect, useRef } from "react";

import { useReport } from "@/app/report/[reportId]/hooks/useReport";

//TODO: link this to report input to get the right height
const reportInputHeightEstimation = 100;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useReportDialogue = () => {
  const reportListRef = useRef<HTMLDivElement | null>(null);
  const { messages } = useReport();

  const scrollToBottom = useCallback(
    _debounce(() => {
      if (reportListRef.current) {
        reportListRef.current.scrollTo({
          top: reportListRef.current.scrollHeight,
          behavior: "auto",
        });
      }
    }, 100),
    []
  );

  useEffect(() => {
    const computeCardHeight = () => {
      if (reportListRef.current) {
        const cardTop = reportListRef.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        const cardHeight = windowHeight - cardTop - reportInputHeightEstimation;
        reportListRef.current.style.height = `${cardHeight}px`;
      }
    };

    computeCardHeight();
    window.addEventListener("resize", computeCardHeight);

    return () => {
      window.removeEventListener("resize", computeCardHeight);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return {
    reportListRef,
  };
};
