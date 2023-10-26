import Link from "next/link";
import { useTranslation } from "react-i18next";

const login = "/login";
export const LoginButton = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Link
      href={login}
      data-testid="login-button"
      className="px-4 py-2 mx-4 my-1 border border-primary bg-white dark:bg-black hover:text-white hover:bg-primary shadow-lg rounded-lg flex items-center justify-center top-1 z-20"
    >
      {t("LoginToView")}
    </Link>
  );
};
