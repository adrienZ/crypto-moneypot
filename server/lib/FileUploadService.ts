import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { randomUUID } from "uncrypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FileUploadService {
  private storage;
  private basePath: string;

  constructor() {
    this.basePath = "./public/uploads"
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

  getUrl(key: string) {
    return `/uploads/${key}`;
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
