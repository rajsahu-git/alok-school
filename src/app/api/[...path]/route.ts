import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

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

  const isFormData = req.headers.get("content-type")?.includes("multipart/form-data");
  const isGet = req.method === "GET" || req.method === "HEAD";

  // Never manually set Content-Type for FormData — browser sets it with boundary
  const forwardHeaders: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(!isFormData && !isGet ? { "Content-Type": req.headers.get("content-type") ?? "application/json" } : {}),
  };

  const body = isGet
    ? undefined
    : isFormData
    ? await req.blob()
    : await req.text();

  try {
    const upstream = await fetch(url, {
      method: req.method,
      headers: forwardHeaders,
      body: body as BodyInit | undefined,
    });

    const contentType = upstream.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json")
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
