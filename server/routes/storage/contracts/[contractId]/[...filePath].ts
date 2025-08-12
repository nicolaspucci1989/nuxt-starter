import { createReadStream, existsSync } from "fs";
import { join } from "path";
import { sendStream, getRouterParam, setHeader } from "h3";

export default defineEventHandler(async (event) => {
  const contractId = getRouterParam(event, "contractId");
  const filePathParam = getRouterParam(event, "filePath");
  if (!contractId || !filePathParam) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: "Missing params" })
    );
  }

  // Construye la ruta real del archivo en tu storage
  const filePath = join(
    process.env.FILE_STORAGE_MOUNT!,
    "contracts",
    contractId,
    ...filePathParam.split("/")
  );


  if (!existsSync(filePath)) {
    return sendError(
      event,
      createError({ statusCode: 404, statusMessage: "File not found" })
    );
  }

  // Opcional: setear Content-Type según extensión
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
    setHeader(event, "Content-Type", "image/jpeg");
  } else if (filePath.endsWith(".png")) {
    setHeader(event, "Content-Type", "image/png");
  }

  return sendStream(event, createReadStream(filePath));
});
