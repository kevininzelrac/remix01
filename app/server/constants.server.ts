function getEnvironmentVariable(name: string): string {
  const variable = process.env[name];
  if (variable === undefined)
    throw new Error(`Environment variable ${name} not found.`);
  return variable;
}

// Database
export const READ_DB_URL = getEnvironmentVariable("READ_DB_URL");
export const WRITE_DB_URL = getEnvironmentVariable("WRITE_DB_URL");

// Authentication
export const ACCESS_TOKEN_SECRET = getEnvironmentVariable(
  "ACCESS_TOKEN_SECRET",
);
export const ACCESS_TOKEN_DURATION = getEnvironmentVariable(
  "ACCESS_TOKEN_DURATION",
);
export const REFRESH_TOKEN_SECRET = getEnvironmentVariable(
  "REFRESH_TOKEN_SECRET",
);
export const REFRESH_TOKEN_DURATION = getEnvironmentVariable(
  "REFRESH_TOKEN_DURATION",
);

// Facebook OAuth
export const FACEBOOK_CLIENT_ID = getEnvironmentVariable("FACEBOOK_CLIENT_ID");
export const FACEBOOK_CLIENT_SECRET = getEnvironmentVariable(
  "FACEBOOK_CLIENT_SECRET",
);

// Github OAuth
export const GITHUB_CLIENT_ID = getEnvironmentVariable("GITHUB_CLIENT_ID");
export const GITHUB_CLIENT_SECRET = getEnvironmentVariable(
  "GITHUB_CLIENT_SECRET",
);

// Google OAuth
export const GOOGLE_CLIENT_ID = getEnvironmentVariable("GOOGLE_CLIENT_ID");
export const GOOGLE_CLIENT_SECRET = getEnvironmentVariable(
  "GOOGLE_CLIENT_SECRET",
);
