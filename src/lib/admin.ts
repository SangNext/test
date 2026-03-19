import { auth } from "./auth";
import { prisma } from "./prisma";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.isAdmin) return null;

  return user;
}
