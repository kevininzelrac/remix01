export abstract class BaseError extends Error {
  abstract getResponse(): Response;
}
