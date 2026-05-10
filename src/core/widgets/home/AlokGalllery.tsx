"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiClient } from "@/lib/apiClient";
// import { FolderOpen } from "lucide-react";

interface Folder {
  _id: string;
  name: string;
  coverImage?: string;
  driveId?: string;
}

interface FoldersResponse {
  folders: Folder[];
}

const AlokGalllery = () => {
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    apiClient
      .get<FoldersResponse>("/gallery/folder-gallery")
      .then((data) => setFolders(data.folders ?? []))
      .catch(() => setFolders([]));
  }, []);

  if (!folders.length) return null;

  const preview = folders.slice(0, 6);

  return (
    <section className="bg-background py-16">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">Our Gallery</h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Glimpses of vibrant campus life, cultural celebrations, and academic excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {preview.map((folder) => (
            <Link
              key={folder._id}
              href={`/gallery/${folder._id}`}
              className="group rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {folder.coverImage ? (
                  <img
                    src={`/api/drive-image?id=${folder.coverImage.match(/[?&]id=([^&]+)/)?.[1]}`}
                    alt={folder.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    {/* <FolderOpen className="w-10 h-10 text-muted-foreground opacity-40" /> */}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-3 left-4 text-white font-semibold capitalize text-sm drop-shadow">
                  {folder.name}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 border border-primary text-primary px-8 py-3 rounded-full text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
          >
            Explore Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AlokGalllery;
