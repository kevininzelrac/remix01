import type { AwilixContainer } from "awilix";
import * as awilix from "awilix";

import type { ServerContext } from "../interfaces";

export enum RegistrationLifetime {
  SCOPED = "SCOPED",
  SINGLETON = "SINGLETON",
  TRANSIENT = "TRANSIENT",
}

export class Container {
  private _container: AwilixContainer<ServerContext>;

  constructor(_container?: AwilixContainer<ServerContext>) {
    this._container =
      _container ??
      awilix.createContainer<ServerContext>({
        injectionMode: awilix.InjectionMode.PROXY,
        strict: true,
      });
  }

  createScope = (request: Request): Container => {
    const scopedContainer = this._container.createScope();
    scopedContainer.register({ request: awilix.asValue(request) });
    return new Container(scopedContainer);
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

  getContext = (): ServerContext => {
    return this._container.cradle;
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
