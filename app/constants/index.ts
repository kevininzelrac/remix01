export const PAGES = {
  SIGN_IN: "/a/signin",
  SIGN_UP: "/a/signup",
  SIGN_OUT: "/a/signout",
  AUTH_LOGIN_API: (providerName: string) => `/api/auth/login/${providerName}`,
  AUTH_CALLBACK_API: (providerName: string) =>
    `/api/auth/callback/${providerName}`,
  HOME: "/",
  WIZARD: (wizardStep: WizardStep) => `/h/wizard/${wizardStep}`,
};

export enum WizardStep {
  INITIAL = "initial",
  VERIFY = "verify",
  PROFILE = "profile",
  PLANS = "plans",
  COMPLETE = "complete",
}

export enum ERROR_TYPES {
  BAD_REQUEST,
  REDIRECT,
}
