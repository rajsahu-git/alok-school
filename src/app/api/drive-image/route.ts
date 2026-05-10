import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const fileId = req.nextUrl.searchParams.get("id");
  if (!fileId) return new NextResponse("Missing id", { status: 400 });

  // Try thumbnail first (faster, more reliable), fallback to uc?export=view
  const urls = [
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`,
    `https://drive.google.com/uc?export=view&id=${fileId}`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Referer: "https://drive.google.com/",
        },
        redirect: "follow",
      });

      if (res.ok) {
        const contentType = res.headers.get("content-type") ?? "image/jpeg";
        const buffer = await res.arrayBuffer();
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=86400",
          },
        });
      }
    } catch {
      continue;
    }
  }

  return new NextResponse("Image not found", { status: 404 });
}
