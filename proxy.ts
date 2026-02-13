import { withAuth } from "next-auth/middleware";

export default withAuth(
  function proxy() {
    // noop: authorization is handled in callbacks.authorized
  },
  {
    pages: {
      signIn: "/",
    },
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        if (pathname.startsWith("/admin")) {
          return token?.level === "admin";
        }

        return Boolean(token);
      },
    },
  }
);

export const config = {
  matcher: ["/account/:path*", "/cart/:path*", "/payment/:path*", "/admin/:path*"],
};
