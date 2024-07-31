// server/api/users.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const posts = await prisma.post.findMany();
    return posts;
  } catch (error) {
    return { error: 'Failed to fetch posts' };
  }
});