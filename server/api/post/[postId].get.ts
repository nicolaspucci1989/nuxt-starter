import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const postId = getRouterParam(event, 'postId');
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    return post;
  } catch (error) {
    return { error: 'Failed to fetch post in post id' };
  }
});