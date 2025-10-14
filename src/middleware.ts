import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_PATH = "http://localhost:5000/v1";

export async function middleware(req: NextRequest) {
  return NextResponse.next();
  const refTokenId = req.cookies.get("refresh_token_id")?.value;
  const url = new URL("/", req.url);

  if (!refTokenId) {
    return NextResponse.redirect(url);
  }

  try {
    const res = await fetch(`${API_PATH}/auth/refreshtoken`, {
      method: "POST",
      headers: {
        Cookie: `refresh_token_id=${refTokenId}`,
      },
      next: { revalidate: 120 },
    });

    if (!res.ok) {
      return NextResponse.redirect(url);
    }
  } catch (error) {
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*"],
};
