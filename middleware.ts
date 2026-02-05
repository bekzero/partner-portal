import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname;
    const role = (req as any).nextauth?.token?.role as
      | "admin"
      | "partner"
      | undefined;

    if (pathname.startsWith("/admin") && role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return Response.redirect(url);
    }
  },
  {
    pages: {
      signIn: "/signin",
    },
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/:path*"],
};
