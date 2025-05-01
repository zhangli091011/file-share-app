import { FileInfo } from '../../../src/app/types';

class FileStorage {
  private files: Map<string, FileInfo> = new Map();

  saveFile(fileInfo: FileInfo): string {
    this.files.set(fileInfo.id, fileInfo);
    return fileInfo.id;
  }

  getFile(id: string): FileInfo | undefined {
    return this.files.get(id);
  }
}

export const fileStorage = new FileStorage(); 