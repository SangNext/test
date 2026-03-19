"use client";

export default function PostImageLayout({ images }: { images: string[] }) {
  if (images.length === 0) return null;

  // 1 image: full width large image
  if (images.length === 1) {
    return (
      <div className="mt-3 rounded-xl overflow-hidden">
        <img src={images[0]} alt="" className="w-full max-h-[300px] object-cover" />
      </div>
    );
  }

  // 2 images: one wide + one narrow
  if (images.length === 2) {
    return (
      <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-xl overflow-hidden">
        <div className="col-span-2 aspect-[4/3]">
          <img src={images[0]} alt="" className="w-full h-full object-cover rounded-l-xl" />
        </div>
        <div className="col-span-1 aspect-[4/3]">
          <img src={images[1]} alt="" className="w-full h-full object-cover rounded-r-xl" />
        </div>
      </div>
    );
  }

  // 3+ images: show first 3 as equal squares
  const displayImages = images.slice(0, 3);
  const moreCount = images.length - 3;

  return (
    <div className="mt-3 grid grid-cols-3 gap-1.5">
      {displayImages.map((src, i) => (
        <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
          <img src={src} alt="" className="w-full h-full object-cover" />
          {i === 2 && moreCount > 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-lg font-bold">+{moreCount}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
