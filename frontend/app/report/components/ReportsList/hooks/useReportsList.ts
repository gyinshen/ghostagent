import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

import { useReportApi } from "@/lib/api/report/useReportApi";
import { useReportsContext } from "@/lib/context/ReportsProvider/hooks/useReportsContext";
import { useToast } from "@/lib/hooks";
import { useDevice } from "@/lib/hooks/useDevice";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useReportsList = () => {
  const { isMobile } = useDevice();
  const [open, setOpen] = useState(!isMobile);
  const { t } = useTranslation(['report']);

  const pathname = usePathname();

  const { setAllReports } = useReportsContext();
  const { publish } = useToast();
  const { getReports } = useReportApi();

  useEffect(() => {
    const fetchAllReports = async () => {
      try {
        const response = await getReports();
        setAllReports(response.reverse());
      } catch (error) {
        console.error(error);
        publish({
          variant: "danger",
          text: t("errorFetching",{ ns : 'report'})
        });
      }
    };
    void fetchAllReports();
  }, []);

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile, pathname]);

  return {
    open,
    setOpen,
  };
};
