/* eslint-disable */
"use client";
import Link from "next/link";
import { HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";

import Button from "@/lib/components/ui/Button";
import { UserStats } from "@/lib/types/User";
import { cn } from "@/lib/utils";
import { DateComponent } from "./Date";

import { RequestsPerDayChart } from "./Graphs/RequestsPerDayChart";

export const UserStatistics = (userStats: UserStats): JSX.Element => {
  const { email, date, requests_stats } =
    userStats;
  const { t } = useTranslation(["translation", "user"]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center py-10 gap-5">
        <div className="flex-1 flex flex-col">
          <h1 className="text-4xl font-semibold">
            {t("title", { user: email.split("@")[0], ns: "user" })}
          </h1>
          <p className="opacity-50">{email}</p>
          <Link className="mt-2" href={"/logout"}>
            <Button className="px-3 py-2" variant={"danger"}>
              {t("logoutButton")}
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <UserStatisticsCard className="">
          <div>
            <h1 className="text-2xl font-semibold">
              {/* The last element corresponds to today's request_count */}
              {t("requestsCount", {
                count: requests_stats.at(-1)?.daily_requests_count,
                ns: "user",
              })}
            </h1>
            <DateComponent date={date} />
          </div>
          <div className="">
            <RequestsPerDayChart {...userStats} />
          </div>
        </UserStatisticsCard>
      </div>
    </>
  );
};

const UserStatisticsCard = ({
  children,
  className,
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("w-full h-full flex flex-col gap-5", className)}>
      {children}
    </div>
  );
};

export default UserStatistics;
