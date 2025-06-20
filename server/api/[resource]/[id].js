// server/api/[resource]/[id].js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define los recursos permitidos y sus operaciones
const ALLOWED_RESOURCES = {
  properties: {
    model: "property",
    select: {
      id: true,
      name: true,
      description: true,
      muscleGroups: true,
      createdAt: true,
    },
  }
};

export default defineEventHandler(async (event) => {
  const { resource, id } = getRouterParams(event);
  const method = event.method.toUpperCase();

  // Validar recurso
  if (!ALLOWED_RESOURCES[resource]) {
    throw createError({
      statusCode: 404,
      statusMessage: "Resource not found",
    });
  }

  const config = ALLOWED_RESOURCES[resource];
  const model = prisma[config.model];

  try {
    switch (method) {
      case "GET":
        return await getById(model, id, config.select);

      case "PUT":
        const updateData = await readBody(event);
        return await updateById(model, id, updateData);

      case "DELETE":
        return await deleteById(model, id);

      default:
        throw createError({
          statusCode: 405,
          statusMessage: "Method not allowed",
        });
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});

// Funciones helper reutilizables
async function getById(model, id, select) {
  const record = await model.findUnique({
    where: { id: parseInt(id) },
    select,
  });

  if (!record) {
    throw createError({
      statusCode: 404,
      statusMessage: "Record not found",
    });
  }

  return record;
}

async function updateById(model, id, data) {
  return await model.update({
    where: { id: parseInt(id) },
    data,
  });
}

async function deleteById(model, id) {
  await model.delete({
    where: { id: parseInt(id) },
  });

  return { success: true };
}
