import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const post = await prisma.post.create({
      data: {...body.post, author: { connect: { id: body.authorId } }},    
    });
    return post
  } catch (error) {
    return { error: "Failed to create new user" };
  }
});
