export interface IFileSystemService {
  saveFile(key: string, binary: ArrayBuffer): Promise<void>;
  getFileUrl(key: string): Promise<string>;
}
