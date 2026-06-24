import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const under_maintaince = false;

export default async function proxy(request: NextRequest) {
  if (under_maintaince) {
    const { pathname } = request.nextUrl;

    if (
      pathname === "/maintenance" ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/static") ||
      pathname.includes(".")
    ) {
      return NextResponse.next();
    }

    const url = request.nextUrl.clone();
    url.pathname = "/maintenance";
    return NextResponse.rewrite(url);
  }

  let response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const protectedRoutes = ["/predictions", "/leaderboard"];

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return response;
}

export const config = {
  matcher: "/:path*",
};
