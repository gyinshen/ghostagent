"use client";
import { ReactNode } from "react";

import { ReportProvider } from "@/lib/context";
import { ReportsProvider } from "@/lib/context/ReportsProvider/reports-provider";
import { useSupabase } from "@/lib/context/SupabaseProvider";
// import { redirectToLogin } from "@/lib/router/redirectToLogin";

import { ReportsList } from "./components/ReportsList";
import { ReportsListNoAuth } from "./components/ReportsListNoAuth";


interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps): JSX.Element => {
  const { session } = useSupabase();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call

  if (session === null) {
    return (
      <ReportsProvider>
        <ReportProvider>
          <div className="relative h-full w-full flex justify-stretch items-stretch">
            <ReportsListNoAuth />
            {children}
          </div>
        </ReportProvider>
      </ReportsProvider>
    );
  }

  return (
    <ReportsProvider>
      <ReportProvider>
        <div className="relative h-full w-full flex justify-stretch items-stretch">
          <ReportsList />
          {children}
        </div>
      </ReportProvider>
    </ReportsProvider>
  );
};

export default Layout;
