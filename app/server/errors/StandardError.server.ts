export class StandardError extends Response {
  constructor(status: number, statusText: string, data: unknown) {
    if (status < 400) {
      throw new Error(
        `Status for a standard error should be >=400. Instead got ${status}.`,
      );
    }

    const body = JSON.stringify({ error: data });
    const headers = new Headers();
    headers.set("Content-Type", "application/json; charset=utf-8");

    super(body, {
      status,
      statusText,
      headers,
    });
  }
}
