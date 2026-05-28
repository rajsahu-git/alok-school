'use client';
import { useState } from 'react';

interface GalleryImage { _id: string; fileId: string; fileName: string; viewLink: string; }

export default function MediaGrid({ images }: { images: GalleryImage[] }) {
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <button key={img._id} onClick={() => setSelected(img)}
            className="group rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300 cursor-zoom-in">
            <div className="aspect-[4/3] overflow-hidden bg-secondary">
              <img src={`/api/drive-image?id=${img.fileId}`} alt={img.fileName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelected(null)}>
          <button onClick={() => setSelected(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img src={`/api/drive-image?id=${selected.fileId}`} alt={selected.fileName}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain" />
        </div>
      )}
    </>
  );
}
