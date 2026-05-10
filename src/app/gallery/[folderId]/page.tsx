"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/apiClient";

function ImageWithLoader({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}

interface GalleryImage {
  _id: string;
  fileName: string;
  directLink: string;
  viewLink: string;
  fileId:string;
}

interface ImagesResponse {
  count: number;
  folderName?: string;
  images: GalleryImage[];
}

export default function FolderGalleryPage() {
  const { folderId } = useParams<{ folderId: string }>();
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .get<ImagesResponse>(`/gallery/image-gallery/${folderId}`)
      .then((data) => {
        setImages(data.images ?? []);
        setFolderName(data.folderName ?? "");
      })
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, [folderId]);

  return (
    <section className="bg-background min-h-screen py-16">
      <div className="container">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {/* <ArrowLeft className="w-4 h-4" /> */}
            Back
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary capitalize">
              {folderName || "Gallery"}
            </h1>
            {!loading && (
              <p className="text-xs text-muted-foreground mt-0.5">{images.length} photos</p>
            )}
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-muted animate-pulse aspect-square" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && images.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
            {/* <ImageOff className="w-12 h-12 opacity-40" /> */}
            <p className="text-sm">No images in this folder.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && images.length > 0 && (
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => 
            {
              const directLink = `/api/drive-image?id=${img.fileId}`
              
              return(
              <button
                key={img._id}
                onClick={() => setLightbox(directLink)}
                className="group relative rounded-xl overflow-hidden aspect-square bg-muted cursor-zoom-in"
              >
                <ImageWithLoader src={directLink} alt={img.fileName} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </button>
            )}
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            onClick={() => setLightbox(null)}
          >
            {/* <X className="w-7 h-7" /> */}
          </button>
          <div className="relative max-w-5xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightbox}
              alt="Preview"
              className="w-full h-full object-contain max-h-[90vh] rounded-lg"
            />
          </div>
        </div>
      )}
    </section>
  );
}
