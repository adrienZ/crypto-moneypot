import {
  defineEventHandler,
  readRawBody,
  getHeader,
  createError,
} from "h3";
import fileUploadService from "~~/server/lib/FileUploadService";

export default defineEventHandler(async (event) => {
  const data = await readRawBody(event);
  if (!data) {
    throw createError({ statusCode: 400, statusMessage: "No file uploaded" });
  }
  const contentType = getHeader(event, "content-type") || "";
  const ext =
    contentType === "image/png"
      ? ".png"
      : contentType === "image/jpeg" || contentType === "image/jpg"
      ? ".jpg"
      : "";
  const key = await fileUploadService.save(
    `upload${ext}`,
    typeof data === "string" ? Buffer.from(data) : data,
  );
  return { key, url: fileUploadService.getUrl(key) };
});
