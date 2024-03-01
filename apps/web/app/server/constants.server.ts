import { z } from "zod";

const schema = z
  .object({
    NODE_ENV: z.union([z.literal("development"), z.literal("production")]),
    PORT: z.string().transform(Number),
    READ_DB_URL: z.string(),
    WRITE_DB_URL: z.string(),
    BASE_URL: z.string(),
    ACCESS_TOKEN_SECRET: z.string(),
    ACCESS_TOKEN_DURATION: z.string(),
    REFRESH_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_DURATION: z.string(),
    FACEBOOK_CLIENT_ID: z.string(),
    FACEBOOK_CLIENT_SECRET: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    MAIL_SERVICE_VARIANT: z.union([z.literal("console"), z.literal("local")]),
    DEFAULT_MAIL_FROM: z.string().default(""),
    GMAIL_USER: z.string().default(""),
    GMAIL_SECRET: z.string().default(""),
  })
  .refine(
    (data) => {
      return (
        data.MAIL_SERVICE_VARIANT !== "local" ||
        (data.DEFAULT_MAIL_FROM && data.GMAIL_USER && data.GMAIL_SECRET)
      );
    },
    {
      message: "If using the local mail variant you must configure it.",
    },
  );

const data = schema.parse(process.env);

// Database
export const READ_DB_URL = data.READ_DB_URL;
export const WRITE_DB_URL = data.WRITE_DB_URL;

// General
export const NODE_ENV = data.NODE_ENV;
export const PORT = data.PORT;
export const BASE_URL = data.BASE_URL;

// Authentication
export const ACCESS_TOKEN_SECRET = data.ACCESS_TOKEN_SECRET;
export const ACCESS_TOKEN_DURATION = data.ACCESS_TOKEN_DURATION;
export const REFRESH_TOKEN_SECRET = data.REFRESH_TOKEN_SECRET;
export const REFRESH_TOKEN_DURATION = data.REFRESH_TOKEN_DURATION;

// Facebook OAuth
export const FACEBOOK_CLIENT_ID = data.FACEBOOK_CLIENT_ID;
export const FACEBOOK_CLIENT_SECRET = data.FACEBOOK_CLIENT_SECRET;

// Github OAuth
export const GITHUB_CLIENT_ID = data.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = data.GITHUB_CLIENT_SECRET;

// Google OAuth
export const GOOGLE_CLIENT_ID = data.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = data.GOOGLE_CLIENT_SECRET;

// Mail
export const MAIL_SERVICE_VARIANT = data.MAIL_SERVICE_VARIANT;
export const DEFAULT_MAIL_FROM = data.DEFAULT_MAIL_FROM;
export const GMAIL_USER = data.GMAIL_USER;
export const GMAIL_SECRET = data.GMAIL_SECRET;
