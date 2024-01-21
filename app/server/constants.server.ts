function getEnvironmentVariable(name: string): string {
  const variable = process.env[name];
  if (variable === undefined)
    throw new Error(`Environment variable ${name} not found.`);
  return variable;
}

export const READ_DB_URL = getEnvironmentVariable("READ_DB_URL");
export const WRITE_DB_URL = getEnvironmentVariable("WRITE_DB_URL");
export const GITHUB_CLIENT_ID = getEnvironmentVariable("GITHUB_CLIENT_ID");
export const GITHUB_CLIENT_SECRET = getEnvironmentVariable(
  "GITHUB_CLIENT_SECRET",
);
