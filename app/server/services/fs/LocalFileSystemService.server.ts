import type { Dependency } from "~/server/injection";
import type { IFileSystemService, ServerContext } from "~/server/interfaces";

import fs from "fs";
import path from "path";

export class LocalFileSystemService
  implements IFileSystemService, Dependency<ServerContext>
{
  constructor(private _basePath: string) {}

  init(context: ServerContext): void {}

  saveFile(key: string, binary: ArrayBuffer): Promise<void> {
    const buffer = Buffer.from(binary);
    return new Promise((resolve, reject) => {
      fs.writeFile(path.join(this._basePath, key), buffer, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  }

  async getFileUrl(key: string): Promise<string> {
    return path.resolve(this._basePath, key);
  }
}
