import type {
  IRequestLifecycleHandler,
  IRequestLifecycleHandlerFactory,
} from "./app";

import type { ServerContext } from "./interfaces";
import { serverContainer } from "./services";
import type { Container } from "./services/container.server";

const READONLY_METHODS = ["GET", "OPTIONS"];

class RequestLifecycleHandler implements IRequestLifecycleHandler {
  private _container: Container;

  constructor(
    private _request: Request,
    _container: Container,
  ) {
    this._container = _container.createScope();
  }

  async initialize(): Promise<void> {
    await this._container.initialize();
  }

  getContext(): ServerContext {
    return this._container.getContext();
  }

  finalize(response?: Response): Promise<void> {
    if (
      !READONLY_METHODS.includes(this._request.method.toUpperCase()) &&
      (!response || response.status >= 400)
    ) {
      return this._container.finalizeError();
    }
    return this._container.finalizeSuccess();
  }
}

export const requestLifecycleHandlerFactory: IRequestLifecycleHandlerFactory = (
  request,
) => {
  return new RequestLifecycleHandler(request, serverContainer);
};
