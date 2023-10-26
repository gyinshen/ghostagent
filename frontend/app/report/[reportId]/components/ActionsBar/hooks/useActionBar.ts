import { useEffect, useState } from "react";

import { useReportContext } from "@/lib/context";

import { checkIfHasPendingRequest } from "../utils/checkIfHasPendingRequest";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useActionBar = () => {
  const [shouldDisplaySuggestions, setshouldDisplaySuggestions] = useState(false);

  const [hasPendingRequests, setHasPendingRequests] = useState(false);
  const { notifications } = useReportContext();

  useEffect(() => {
    setHasPendingRequests(checkIfHasPendingRequest(notifications));
  }, [notifications]);

  return {
    shouldDisplaySuggestions,
    setshouldDisplaySuggestions,
    hasPendingRequests,
    setHasPendingRequests,
  };
};
