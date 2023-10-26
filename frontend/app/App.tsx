"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

import Footer from "@/lib/components/Footer";
import { NavBar } from "@/lib/components/NavBar";
import { UpdateMetadata } from "@/lib/helpers/updateMetadata";
// import { usePageTracking } from "@/services/analytics/usePageTracking";
import "../lib/config/LocaleConfig/i18n";

const queryClient = new QueryClient();

// This wrapper is used to make effect calls at a high level in app rendering.
export const App = ({ children }: PropsWithChildren): JSX.Element => {
  
  // const { session } = useSupabase();

  // usePageTracking();


  return (
    <QueryClientProvider client={queryClient}>
      <NavBar />
      <div className="flex-1">{children}</div>
      <Footer />
      <UpdateMetadata />
    </QueryClientProvider>
  );
};
