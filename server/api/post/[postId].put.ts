import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const postId = getRouterParam(event, "postId");
    const body = await readBody(event);
    const post = await prisma.post.update({
      where: {
        id: Number(postId),
      },
      data: body.post,
    });
    return post
  } catch (error) {
    return { error: "Failed to put post" };
  }
});
