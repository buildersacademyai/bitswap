import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "stacks-auth-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

// Helper for API routes
export function withSessionRoute(handler: any) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

// Helper for SSR functions
export function withSessionSsr(handler: any) {
  return withIronSessionSsr(handler, sessionOptions);
}
