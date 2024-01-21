export const pages = {
  SIGN_IN: "/a/signin",
  SIGN_UP: "/a/signup",
  AUTH_LOGIN_API: (providerName: string) => `/api/auth/login/${providerName}`,
  AUTH_CALLBACK_API: (providerName: string) =>
    `/api/auth/callback/${providerName}`,
  HOME: "/",
};
