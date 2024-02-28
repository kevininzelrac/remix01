import type { IFileSystemService } from "~/types/IFileSystemService";

import fs from "node:fs";
import path from "node:path";

export class LocalFileSystemService implements IFileSystemService {
  constructor(private _basePath: string) {}

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

export type LocalFileSystemServiceOptions = {
  path: string;
};

export const getLocalFileSystemService =
  ({ path }: LocalFileSystemServiceOptions) =>
  () => {
    return new LocalFileSystemService(path);
  };
