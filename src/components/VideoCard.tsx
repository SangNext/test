import Link from "next/link";

interface VideoCardProps {
  id: string;
  title: string;
  authorName: string;
  filePath: string;
  createdAt: string;
}

export default function VideoCard({ id, title, authorName, filePath, createdAt }: VideoCardProps) {
  return (
    <Link href={`/video/${id}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100">
        <div className="aspect-video bg-gray-900 relative">
          <video
            src={filePath}
            className="w-full h-full object-cover"
            muted
            preload="metadata"
            onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
            onMouseOut={(e) => {
              const v = e.target as HTMLVideoElement;
              v.pause();
              v.currentTime = 0;
            }}
          />
        </div>
        <div className="p-3">
          <h3 className="font-medium text-gray-900 line-clamp-2">{title}</h3>
          <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
            <span>{authorName}</span>
            <span>{new Date(createdAt).toLocaleDateString("zh-CN")}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
