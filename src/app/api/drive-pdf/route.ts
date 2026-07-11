import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const fileId = req.nextUrl.searchParams.get("id");
  if (!fileId) return new NextResponse("Missing id", { status: 400 });

  const forceDownload = req.nextUrl.searchParams.get("dl") === "1";

  try {
    const res = await fetch(`https://drive.google.com/uc?export=download&id=${fileId}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      redirect: "follow",
    });
    if (!res.ok) return new NextResponse("PDF not found", { status: 404 });

    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${forceDownload ? "attachment" : "inline"}; filename="document.pdf"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new NextResponse("Failed to fetch PDF", { status: 502 });
  }
}
