// import { useTranslation } from "react-i18next";
// import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { ReportInput } from "./components";
import { useActionBar } from "./hooks/useActionBar";



export const ActionsBar = (): JSX.Element => {

  const {
    shouldDisplaySuggestions,
    // setshouldDisplaySuggestions,
    // hasPendingRequests,
    // setHasPendingRequests,
  } = useActionBar();


  // const { t } = useTranslation(["report"]);

  return (
    <>
      {/* {hasPendingRequests && (
        <div className="flex mt-1 flex-row w-full shadow-md dark:shadow-primary/25 hover:shadow-xl transition-shadow rounded-xl bg-white dark:bg-black border border-black/10 dark:border-white/25 p-2 pl-6">
          <div className="flex flex-1 items-center">
            <span className="text-1xl">{t("filesUploading")}</span>
          </div>
          <AiOutlineLoading3Quarters className="animate-spin text-3xl" />
        </div>
      )} */}

      <div
        className={
          shouldDisplaySuggestions ? "h-full flex flex-col flex-auto" : ""
        }
      >
        {shouldDisplaySuggestions && (
          <div className="flex flex-1 overflow-y-scroll shadow-md dark:shadow-primary/25 hover:shadow-xl transition-shadow rounded-xl bg-white dark:bg-black border border-black/10 dark:border-white/25 p-6">
            Enter a new question
          </div>
        )}
        <div className="flex mt-1 flex-col w-full shadow-md dark:shadow-primary/25 hover:shadow-xl transition-shadow rounded-xl bg-white dark:bg-black border border-black/10 dark:border-white/25 p-6">
          <ReportInput
          />
        </div>
      </div>
    </>
  );
};