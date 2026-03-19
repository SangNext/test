import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import UploadForm from "@/components/UploadForm";

export default async function UploadPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">上传视频</h1>
        <p className="text-gray-500 text-sm mt-1">分享你的精彩内容</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-8">
        <UploadForm />
      </div>
    </div>
  );
}
