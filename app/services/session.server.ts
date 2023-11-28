import { createCookieSessionStorage } from "@remix-run/node";

export const userSession = createCookieSessionStorage({
  cookie: {
    name: "user",
    httpOnly: true,
    //maxAge: 24 * 60 * 60,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET as string],
    secure: process.env.NODE_ENV === "production",
  },
});

export const newUserSession = createCookieSessionStorage({
  cookie: {
    name: "user",
    httpOnly: true,
    //maxAge: 24 * 60 * 60,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET as string],
    secure: process.env.NODE_ENV === "production",
  },
});
