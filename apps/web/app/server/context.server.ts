import { getConsoleLoggerService } from "@app/services/logger/ConsoleLoggerService";
import { getUserService } from "@app/services/models/UserService";
import { getSessionService } from "@app/services/session/SessionService";
import { getOAuthProviderFactoryService } from "@app/services/session/OAuthProviderFactoryService";
import { getConsoleMailService } from "@app/services/mail/ConsoleMailService";
import { getLocalMailService } from "@app/services/mail/LocalMailService";
import { getClockService } from "@app/services/clock/ClockService";
import { getLocalFileSystemService } from "@app/services/fs/LocalFileSystemService";
import { getDatabaseService } from "@app/services/db/DatabaseService";
import { getLocalProductService } from "@app/services/pricing/LocalProductService";
import { Container, RegistrationLifetime } from "@app/services/container";
import { LogLevel } from "@app/services/types/ILoggerService";

import {
  ACCESS_TOKEN_DURATION,
  ACCESS_TOKEN_SECRET,
  BASE_URL,
  DEFAULT_MAIL_FROM,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GMAIL_SECRET,
  GMAIL_USER,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  MAIL_SERVICE_VARIANT,
  NODE_ENV,
  READ_DB_URL,
  REFRESH_TOKEN_DURATION,
  REFRESH_TOKEN_SECRET,
} from "./constants.server";

import { PAGES } from "~/constants";

export const serverContainer = getServerContainer();

// Change the logic here to determine what container gets injected
function getServerContainer(): Container {
  const container = new Container();

  container.register(
    "clockService",
    getClockService(),
    RegistrationLifetime.SINGLETON,
  );

  container.register(
    "fileSystemService",
    getLocalFileSystemService({
      path: "./.data",
    }),
    RegistrationLifetime.SINGLETON,
  );

  container.register(
    "loggerService",
    getConsoleLoggerService({
      logLevel: LogLevel.DEBUG,
    }),
    RegistrationLifetime.SINGLETON,
  );

  switch (MAIL_SERVICE_VARIANT) {
    case "console": {
      container.register(
        "mailService",
        getConsoleMailService(),
        RegistrationLifetime.SINGLETON,
      );
      break;
    }
    case "local": {
      container.register(
        "mailService",
        getLocalMailService({
          host: "smtp.gmail.com",
          user: GMAIL_USER,
          secret: GMAIL_SECRET,
          from: DEFAULT_MAIL_FROM,
        }),
        RegistrationLifetime.SINGLETON,
      );
      break;
    }
  }

  container.register(
    "oauthProviderFactoryService",
    getOAuthProviderFactoryService({
      env: NODE_ENV,
      providers: {
        facebook: {
          clientId: FACEBOOK_CLIENT_ID,
          clientSecret: FACEBOOK_CLIENT_SECRET,
          redirectUri: new URL(PAGES.AUTH_CALLBACK_API("facebook"), BASE_URL),
        },
        github: {
          clientId: GITHUB_CLIENT_ID,
          clientSecret: GITHUB_CLIENT_SECRET,
          redirectUri: new URL(PAGES.AUTH_CALLBACK_API("github"), BASE_URL),
        },
        google: {
          clientId: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          redirectUri: new URL(PAGES.AUTH_CALLBACK_API("google"), BASE_URL),
        },
      },
    }),
    RegistrationLifetime.SINGLETON,
  );

  container.register(
    "databaseService",
    getDatabaseService({
      readDbUrl: READ_DB_URL,
    }),
    RegistrationLifetime.SCOPED,
    {
      onInitialize: async (context) => {
        await context.databaseService.begin();
      },
      onFinalizeSuccess: async (context) => {
        await context.databaseService.commit();
      },
      onFinalizeError: async (context) => {
        await context.databaseService.rollback();
      },
    },
  );

  container.register(
    "sessionService",
    getSessionService({
      cookieName: "webapp_auth",
      cookieSerializeOptions: {
        httpOnly: true,
        secure: NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60,
        sameSite: "strict",
      },
      accessTokenConfiguration: {
        secret: ACCESS_TOKEN_SECRET,
        duration: ACCESS_TOKEN_DURATION,
      },
      refreshTokenConfiguration: {
        secret: REFRESH_TOKEN_SECRET,
        duration: REFRESH_TOKEN_DURATION,
      },
      signInRedirectUri: new URL(PAGES.HOME, BASE_URL),
      signOutRedirectUri: new URL(PAGES.SIGN_IN, BASE_URL),
    }),
    RegistrationLifetime.SCOPED,
  );

  container.register(
    "userService",
    getUserService(),
    RegistrationLifetime.SCOPED,
  );

  container.register(
    "productService",
    getLocalProductService(),
    RegistrationLifetime.SCOPED,
  );

  return container;
}
