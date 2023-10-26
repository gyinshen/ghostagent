"use client";
import Link from "next/link";
import { Dispatch, HTMLAttributes, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { MdPerson } from "react-icons/md";

import { useSupabase } from "@/lib/context/SupabaseProvider";
import { cn } from "@/lib/utils";

import { AuthButtons } from "./components/AuthButtons";
import { DarkModeToggle } from "./components/DarkModeToggle";
// import { LanguageDropDown } from "./components/LanguageDropDown";
import { NavLink } from "./components/NavLink";

interface NavItemsProps extends HTMLAttributes<HTMLUListElement> {
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export const NavItems = ({
  className,
  setOpen,
  ...props
}: NavItemsProps): JSX.Element => {
  const { session } = useSupabase();
  const isUserLoggedIn = session?.user !== undefined;
  const { t } = useTranslation();

  return (
    <ul
      className={cn(
        "flex flex-row items-center gap-4 text-sm flex-1",
        className
      )}
      {...props}
    >
      {isUserLoggedIn ? (
        <>
          <NavLink setOpen={setOpen} to="/report">
            {t("Report")}
          </NavLink>
        </>
      ) : (
        <>
          <NavLink setOpen={setOpen} to="/report">
            Report
          </NavLink>
        </>
      )}
      <div className="flex sm:flex-1 sm:justify-end flex-col items-center justify-center sm:flex-row gap-5 sm:gap-2">
        {isUserLoggedIn && (
          <>
            <Link aria-label="account" className="" href={"/user"}>
              <MdPerson className="text-2xl" />
            </Link>
          </>
        )}
        {!isUserLoggedIn && <AuthButtons />}
        {/* <LanguageDropDown /> */}
        <DarkModeToggle />
      </div>
    </ul>
  );
};
