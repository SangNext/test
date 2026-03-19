import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// One-time endpoint to set the first admin user
// Only works if there are no admin users yet
export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) return NextResponse.json({ error: "需要邮箱" }, { status: 400 });

  const adminCount = await prisma.user.count({ where: { isAdmin: true } });
  if (adminCount > 0) {
    return NextResponse.json({ error: "已存在管理员，请通过管理后台设置" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { email },
    data: { isAdmin: true },
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json({ message: `${user.name} 已设为管理员`, user });
}
