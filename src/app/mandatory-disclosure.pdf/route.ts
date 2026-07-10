import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function GET() {
  try {
    const activeRes = await fetch(`${BACKEND}/api/mandatory-disclosure/active`, { cache: "no-store" });
    if (!activeRes.ok) {
      return new NextResponse("Mandatory disclosure not found", { status: 404 });
    }

    const disclosure = await activeRes.json();
    const fileId = disclosure?.file?.fileId;
    if (!fileId) {
      return new NextResponse("Mandatory disclosure not found", { status: 404 });
    }

    const pdfRes = await fetch(`https://drive.google.com/uc?export=download&id=${fileId}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      redirect: "follow",
    });
    if (!pdfRes.ok) {
      return new NextResponse("Failed to fetch mandatory disclosure PDF", { status: 502 });
    }

    const buffer = await pdfRes.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="mandatory-disclosure.pdf"',
        "Cache-Control": "no-store, must-revalidate",
      },
    });
  } catch (err) {
    console.error("[mandatory-disclosure.pdf]", err);
    return new NextResponse("Error fetching mandatory disclosure", { status: 502 });
  }
}
