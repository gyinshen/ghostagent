
import { useEffect, useState } from "react";

// import { useTranslation } from 'react-i18next';
import { useDevice } from "@/lib/hooks/useDevice";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useReportsListNoAuth = () => {
  const { isMobile } = useDevice();
  const [open, setOpen] = useState(!isMobile);
  // const { t } = useTranslation(['report']);


  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  return {
    open,
    setOpen,
  };
};
