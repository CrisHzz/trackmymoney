import { NextResponse } from "next/server";

// Middleware temporalmente deshabilitado para desarrollo sin Clerk
export default function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 