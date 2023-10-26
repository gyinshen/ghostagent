import { createContext, PropsWithChildren } from "react";

import { ReportContextProps } from "../types";

export const ReportContextMock = createContext<ReportContextProps | undefined>(
  undefined
);

export const ReportProviderMock = ({
  children,
}: PropsWithChildren): JSX.Element => {
  return (
    <ReportContextMock.Provider
      value={{
        messages: [],
        setMessages: () => void 0,
        addToHistory: () => void 0,
        updateHistory: () => void 0,
        updateStreamingHistory: () => void 0,
        notifications: [],
        setNotifications: () => void 0,
      }}
    >
      {children}
    </ReportContextMock.Provider>
  );
};
