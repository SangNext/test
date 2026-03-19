import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import UploadForm from "@/components/UploadForm";

export default async function UploadPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-center mb-8">上传视频</h1>
      <UploadForm />
    </div>
  );
}
