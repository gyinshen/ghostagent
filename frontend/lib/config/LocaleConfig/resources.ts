/* eslint-disable import/order */
/* eslint-disable max-lines */
// import all namespaces English

import report_en from "../../../public/locales/en/report.json";
import config_en from "../../../public/locales/en/config.json";
import login_en from "../../../public/locales/en/login.json";
import logout_en from "../../../public/locales/en/logout.json";
import signUp_en from "../../../public/locales/en/signUp.json";
import translation_en from "../../../public/locales/en/translation.json";
import updatePassword_en from "../../../public/locales/en/updatePassword.json";
import user_en from "../../../public/locales/en/user.json";


//type all translations
export type Translations = {

  report: typeof import("../../../public/locales/en/report.json");
  config: typeof import("../../../public/locales/en/config.json");
  login: typeof import("../../../public/locales/en/login.json");
  logout: typeof import("../../../public/locales/en/logout.json");
  signUp: typeof import("../../../public/locales/en/signUp.json");
  translation: typeof import("../../../public/locales/en/translation.json");
  updatePassword: typeof import("../../../public/locales/en/updatePassword.json");
  user: typeof import("../../../public/locales/en/user.json");
};

enum SupportedLanguages {
  en = "en",
}

export const defaultNS = "translation";
export const resources: Record<SupportedLanguages, Translations> = {
  en: {
    report: report_en,
    config: config_en,
    login: login_en,
    logout: logout_en,
    signUp: signUp_en,
    translation: translation_en,
    updatePassword: updatePassword_en,
    user: user_en,
  }
} as const;
