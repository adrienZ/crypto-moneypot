import { defineEventHandler } from "h3";
import { createIPX, handleRequest } from "ipx";
import fileUploadService from "~~/server/lib/FileUploadService";

const ipx = createIPX({ dir: fileUploadService.getBasePath() });

export default defineEventHandler((event) => handleRequest(event, ipx));
