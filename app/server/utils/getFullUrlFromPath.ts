export const getFullUrlFromPath = (request: Request, path: string): URL => {
  const base = new URL(request.url);
  return new URL(path, base);
};
