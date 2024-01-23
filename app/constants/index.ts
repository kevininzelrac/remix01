export const PAGES = {
  SIGN_IN: "/a/signin",
  SIGN_UP: "/a/signup",
  SIGN_OUT: "/a/signout",
  AUTH_LOGIN_API: (providerName: string) => `/api/auth/login/${providerName}`,
  AUTH_CALLBACK_API: (providerName: string) =>
    `/api/auth/callback/${providerName}`,
  HOME: "/",
  WIZARD: (wizardStep: string) => `/h/wizard/${wizardStep}`,
};

export const WIZARD_STEP = {
  INITIAL: "initial",
  PROFILE: "profile",
  PLANS: "plans",
  COMPLETE: "complete",
} as const;
