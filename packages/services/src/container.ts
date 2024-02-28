import type { AwilixContainer } from "awilix";
import * as awilix from "awilix";

import type { ServerContext } from "./types/ServerContext";
import { getRequestService } from "./request/RequestService";

export enum RegistrationLifetime {
  SCOPED = "SCOPED",
  SINGLETON = "SINGLETON",
  TRANSIENT = "TRANSIENT",
}

export class Container<ContextType extends ServerContext | never = never> {
  private _root: boolean;
  private _container: AwilixContainer<ServerContext>;

  constructor(_container?: AwilixContainer<ServerContext>) {
    this._root = _container === undefined;
    this._container =
      _container ??
      awilix.createContainer<ServerContext>({
        injectionMode: awilix.InjectionMode.PROXY,
        strict: true,
      });
  }

  createScope = (request: Request | null = null): Container<ServerContext> => {
    const scopedContainer = new Container(this._container.createScope());

    scopedContainer.register(
      "requestService",
      getRequestService(request),
      RegistrationLifetime.SCOPED,
    );

    return scopedContainer;
  };

  initialize = (): Promise<void> => {
    return this._container.cradle.databaseService.begin();
  };

  register = <K extends keyof ServerContext>(
    name: K,
    factory: (context: ServerContext) => ServerContext[K],
    lifetime: RegistrationLifetime,
  ): void => {
    let registration = awilix.asFunction(factory);

    if (lifetime === RegistrationLifetime.SCOPED) {
      registration = registration.scoped();
    } else if (lifetime === RegistrationLifetime.SINGLETON) {
      registration = registration.singleton();
    } else if (lifetime === RegistrationLifetime.TRANSIENT) {
      registration = registration.transient();
    } else {
      throw new Error("Invalid registration lifetime");
    }

    this._container.register({
      [name]: registration,
    });
  };

  getContext = (): ContextType => {
    if (this._root) {
      throw new Error("Can only return context of scoped container");
    }
    return this._container.cradle as unknown as ContextType;
  };

  finalizeSuccess = async (): Promise<void> => {
    await this._container.cradle.databaseService.commit();
    this._container.dispose();
  };

  finalizeError = async (): Promise<void> => {
    await this._container.cradle.databaseService.rollback();
    this._container.dispose();
  };
}
