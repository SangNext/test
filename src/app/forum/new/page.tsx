import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewPostForm from "@/components/NewPostForm";

export default async function NewPostPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">发表新帖</h1>
        <p className="text-gray-500 text-sm mt-1">分享你的想法</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-8">
        <NewPostForm />
      </div>
    </div>
  );
}
