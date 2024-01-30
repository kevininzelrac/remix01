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
      const keyPath = this._resolveKey(key);
      fs.mkdirSync(path.dirname(keyPath), { recursive: true });
      fs.writeFile(keyPath, buffer, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  }

  async getFileUrl(key: string): Promise<string> {
    return `file://${this._resolveKey(key)}`;
  }

  _resolveKey(key: string): string {
    return path.resolve(path.join(this._basePath, key));
  }
}
