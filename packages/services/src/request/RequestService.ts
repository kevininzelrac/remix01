import { IRequestService } from "~/types/IRequestService";

export class RequestService implements IRequestService {
  constructor(private _request: Request | null = null) {}

  getRequest(): Request | null {
    return this._request;
  }
}

export const getRequestService =
  (request: Request | null = null) =>
  () => {
    return new RequestService(request);
  };
