export const PAGES = {
  SIGN_IN: "/a/signin",
  SIGN_UP: "/a/signup",
  AUTH_LOGIN_API: (providerName: string) => `/api/auth/login/${providerName}`,
  AUTH_CALLBACK_API: (providerName: string) =>
    `/api/auth/callback/${providerName}`,
  HOME: "/",
};

export const WIZARD_STEP = {
  INITIAL: "initial",
  PROFILE: "profile",
  COMPLETE: "complete",
};
