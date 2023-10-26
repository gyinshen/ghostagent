import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import { cookies, headers } from "next/headers";

import { ToastProvider } from "@/lib/components/ui/Toast";
import { FeatureFlagsProvider } from "@/lib/context";
import { SupabaseProvider } from "@/lib/context/SupabaseProvider";

import { App } from "./App";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "mrg - AI research agent",
  description:
    "MyResearchGhost automatically conduct research on the internet and generate a brief report on any topic.",
};

const RootLayout = async ({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> => {
  const supabase = createServerComponentSupabaseClient({
    headers,
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body
        className={`bg-white text-black min-h-screen flex flex-col dark:bg-black dark:text-white w-full ${inter.className}`}
      >
        <FeatureFlagsProvider>
          <ToastProvider>
            <SupabaseProvider session={session}>
              <App>
                <div className="flex-1">{children}</div>
              </App>
            </SupabaseProvider>
          </ToastProvider>
          <Analytics />
        </FeatureFlagsProvider>
      </body>
    </html>
  );
};

export default RootLayout;
