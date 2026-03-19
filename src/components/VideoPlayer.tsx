"use client";

interface VideoPlayerProps {
  src: string;
  title: string;
}

export default function VideoPlayer({ src, title }: VideoPlayerProps) {
  return (
    <div className="aspect-video bg-black rounded-xl overflow-hidden">
      <video
        src={src}
        controls
        autoPlay
        className="w-full h-full"
        title={title}
      />
    </div>
  );
}
