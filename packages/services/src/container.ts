import type { Awaitable } from "@app/utils/types";
import type { AwilixContainer } from "awilix";
import * as awilix from "awilix";

import type { ServerContext } from "./types/ServerContext";
import { getRequestService } from "./request/RequestService";
import { AssertionError } from "@app/utils/errors/AssertionError";

export enum RegistrationLifetime {
  SCOPED = "SCOPED",
  SINGLETON = "SINGLETON",
  TRANSIENT = "TRANSIENT",
}

export type RegistrationHooks = {
  onInitialize: (context: ServerContext) => Awaitable<void>;
  onFinalizeSuccess: (context: ServerContext) => Awaitable<void>;
  onFinalizeError: (context: ServerContext) => Awaitable<void>;
};

export class Container<ContextType extends ServerContext | never = never> {
  private _root: boolean;
  private _container: AwilixContainer<ServerContext>;

  constructor(
    _container?: AwilixContainer<ServerContext>,
    private _onInitializeHooks: RegistrationHooks["onInitialize"][] = [],
    private _onFinalizeSuccessHooks: RegistrationHooks["onFinalizeSuccess"][] = [],
    private _onFinalizeErrorHooks: RegistrationHooks["onFinalizeError"][] = [],
  ) {
    this._root = _container === undefined;

    this._container =
      _container ??
      awilix.createContainer<ServerContext>({
        injectionMode: awilix.InjectionMode.PROXY,
        strict: true,
      });
  }

  createScope = (request: Request | null = null): Container<ServerContext> => {
    const scopedContainer = new Container(
      this._container.createScope(),
      this._onInitializeHooks,
      this._onFinalizeSuccessHooks,
      this._onFinalizeErrorHooks,
    );

    scopedContainer.register(
      "requestService",
      getRequestService(request),
      RegistrationLifetime.SCOPED,
    );

    return scopedContainer;
  };

  initialize = async (): Promise<void> => {
    await Promise.all(
      this._onInitializeHooks.map((callback) =>
        callback(this._container.cradle),
      ),
    );
  };

  register = <K extends keyof ServerContext>(
    name: K,
    factory: (context: ServerContext) => ServerContext[K],
    lifetime: RegistrationLifetime,
    hooks?: RegistrationHooks,
  ): void => {
    let registration = awilix.asFunction(factory);

    if (lifetime === RegistrationLifetime.SCOPED) {
      registration = registration.scoped();
    } else if (lifetime === RegistrationLifetime.SINGLETON) {
      registration = registration.singleton();
    } else if (lifetime === RegistrationLifetime.TRANSIENT) {
      registration = registration.transient();
    } else {
      throw new AssertionError("Invalid registration lifetime");
    }

    this._container.register({
      [name]: registration,
    });

    if (hooks && hooks.onInitialize) {
      this._onInitializeHooks.push(hooks.onInitialize);
    }
    if (hooks && hooks.onFinalizeSuccess) {
      this._onInitializeHooks.push(hooks.onFinalizeSuccess);
    }
    if (hooks && hooks.onFinalizeError) {
      this._onInitializeHooks.push(hooks.onFinalizeError);
    }
  };

  getContext = (): ContextType => {
    if (this._root) {
      throw new AssertionError("Can only return context of scoped container");
    }
    return this._container.cradle as unknown as ContextType;
  };

  finalizeSuccess = async (): Promise<void> => {
    await Promise.all(
      this._onInitializeHooks.map((callback) =>
        callback(this._container.cradle),
      ),
    );
    this._container.dispose();
  };

  finalizeError = async (): Promise<void> => {
    await Promise.all(
      this._onInitializeHooks.map((callback) =>
        callback(this._container.cradle),
      ),
    );
    this._container.dispose();
  };
}
