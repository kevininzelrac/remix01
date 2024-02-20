import type { AwilixContainer } from "awilix";
import type { ServerContext } from "../interfaces";

export class Container {
  constructor(private _container: AwilixContainer<ServerContext>) {}

  createScope = (): Container => {
    return new Container(this._container.createScope());
  };

  initialize = (): Promise<void> => {
    return this._container.cradle.databaseService.begin();
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
