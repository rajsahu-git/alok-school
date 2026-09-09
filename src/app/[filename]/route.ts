import { NextRequest, NextResponse } from "next/server";
import { notFound } from "next/navigation";
import { disclosureSlug } from "@/lib/disclosureSlug";

export const dynamic = "force-dynamic";

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

interface Disclosure {
  title?: string;
  file: {
    fileName: string;
    filePath?: string;
    fileId?: string; // legacy field, from documents uploaded before local storage
  };
}

// Serves mandatory-disclosure PDFs at a clean root URL, e.g. /fee-structure-2026-27.pdf,
// instead of exposing the backend host, the /uploads path, or the uploaded file's raw name.
export async function GET(req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  if (!filename.toLowerCase().endsWith(".pdf")) notFound();

  const forceDownload = req.nextUrl.searchParams.get("dl") === "1";

  const listRes = await fetch(`${BACKEND}/api/mandatory-disclosure`, { cache: "no-store" });
  if (!listRes.ok) notFound();

  const { disclosures = [] } = (await listRes.json()) as { disclosures: Disclosure[] };
  const disclosure = disclosures.find((d) => disclosureSlug(d) === filename);
  if (!disclosure) notFound();

  const { filePath, fileId } = disclosure.file;
  const sourceUrl = filePath
    ? `${BACKEND}/uploads/mandatory-disclosure/${filePath}`
    : fileId
    ? `https://drive.google.com/uc?export=download&id=${fileId}`
    : null;
  if (!sourceUrl) notFound();

  const pdfRes = await fetch(sourceUrl, { headers: { "User-Agent": "Mozilla/5.0" }, redirect: "follow" });
  if (!pdfRes.ok) return new NextResponse("Failed to fetch file", { status: 502 });

  const buffer = await pdfRes.arrayBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${forceDownload ? "attachment" : "inline"}; filename="${filename}"`,
      "Cache-Control": "no-store, must-revalidate",
    },
  });
}
