import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ChatRoom from "@/components/ChatRoom";

export default async function ChatPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <ChatRoom
      userId={session.user.id!}
      userName={session.user.name!}
    />
  );
}
