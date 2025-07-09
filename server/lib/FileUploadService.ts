import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import path from "node:path";
import { randomUUID } from "uncrypto";

class FileUploadService {
  private storage;
  private basePath: string;

  constructor() {
    this.basePath = "./public/uploads";
    this.storage = createStorage({
      driver: fsDriver({ base: this.basePath }),
    });
  }

  async save(fileName: string, data: Buffer) {
    const ext = path.extname(fileName);
    const key = `${randomUUID()}${ext}`;
    await this.storage.setItemRaw(key, data);
    return key;
  }

  getUrl(maybeFileNameOrUrl: string) {
    try {
      const url = new URL(maybeFileNameOrUrl);
      if (url.protocol === "http:" || url.protocol === "https:") {
        return maybeFileNameOrUrl;
      }
    } catch {
      // Not a valid URL, continue
    }

    return `/uploads/${maybeFileNameOrUrl}`;
  }

  getPath(key: string) {
    return path.join(this.basePath, key);
  }

  getBasePath() {
    return this.basePath;
  }
}

const fileUploadService = new FileUploadService();
export default fileUploadService;
