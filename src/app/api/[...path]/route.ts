import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const maxDuration = 60;
export const dynamic = 'force-dynamic';
// Node.js Serverless Functions on Vercel cap the request body at ~4.5MB (AWS Lambda
// payload limit), which silently truncated/rejected image uploads above that size.
// Edge Functions stream the body instead of buffering it, so they aren't bound by that limit.
export const runtime = 'edge';

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const pathname = path.join("/");
  const search = req.nextUrl.search ?? "";
  const url = `${BACKEND}/api/${pathname}${search}`;

  const cookieStore = await cookies();
  const tokenFromCookie = cookieStore.get("admin_token")?.value;
  const tokenFromHeader = req.headers.get("authorization")?.replace("Bearer ", "");
  const token = tokenFromCookie ?? tokenFromHeader ?? null;

  const contentType = req.headers.get("content-type") ?? "";
  const isFormData = contentType.includes("multipart/form-data");
  const isGet = req.method === "GET" || req.method === "HEAD";

  // Build forward headers
  const forwardHeaders: Record<string, string> = {};
  if (token) forwardHeaders["Authorization"] = `Bearer ${token}`;

  // For FormData: MUST forward the original Content-Type with boundary intact
  // For JSON: set Content-Type manually
  // For GET: no Content-Type needed
  if (isFormData) {
    forwardHeaders["Content-Type"] = contentType; // includes boundary
  } else if (!isGet) {
    forwardHeaders["Content-Type"] = contentType || "application/json";
  }

  let body: BodyInit | undefined = undefined;
  if (!isGet) {
    if (isFormData) {
      // Stream the body directly to preserve multipart boundaries
      body = req.body as BodyInit;
    } else {
      body = await req.arrayBuffer();
    }
  }

  try {
    const upstream = await fetch(url, {
      method: req.method,
      headers: forwardHeaders,
      body,
      // @ts-expect-error — disable duplex warning in Node fetch
      duplex: "half",
    });

    const upstreamContentType = upstream.headers.get("content-type") ?? "";
    const data = upstreamContentType.includes("application/json")
      ? await upstream.json()
      : await upstream.text();

    return NextResponse.json(
      typeof data === "string" ? { message: data } : data,
      { status: upstream.status }
    );
  } catch (err) {
    console.error("[proxy error]", url, err);
    return NextResponse.json({ message: "Proxy error" }, { status: 502 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
