import { PrismaClient } from "@prisma/client";
import { ServerFile } from "nuxt-file-storage";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const { contract } = await readBody(event);
    let storedFiles = [];

    const { files, ...rest } = contract;

    const createdContract = await prisma.contract.create({
      data: rest,
    });

    const basePath = `contracts/${createdContract.id}`;

    for (const file of files as ServerFile[]) {
      const result = await storeFileLocally(file, 8, basePath);
      storedFiles.push({
        name: result,
        originalName: file.name,
        path: `${basePath}/${result}`,
        fullPath: `${process.env.BASE_URL}/${basePath}/${result}`,
        type: file.type,
      });
    }

    await prisma.contract.update({
      where: { id: createdContract.id },
      data: {
        media: JSON.stringify(storedFiles),
      },
    });

    return { ok: true };
  } catch (error) {
    console.log(error);
    return { error: "Failed to create new contract" };
  }
});
