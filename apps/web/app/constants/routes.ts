import type { WizardStep } from "@app/utils/constants";

export const PAGES = {
  SIGN_IN: "/a/signin",
  FORGOT_PASSWORD: "/a/forgot-password",
  SIGN_UP: "/a/signup",
  SIGN_OUT: "/a/signout",
  AUTH_LOGIN_API: (providerName: string) => `/api/auth/login/${providerName}`,
  AUTH_CALLBACK_API: (providerName: string) =>
    `/api/auth/callback/${providerName}`,
  HOME: "/",
  SETUP: "/h/setup",
  WIZARD: (wizardStep: WizardStep) => `/h/wizard/${wizardStep}`,
};
