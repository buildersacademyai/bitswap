import { withSessionSsr } from "@/utils/session";
import { useEffect, useState } from "react";

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const user = req.session.user || null;

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: { user } };
});

export default function Dashboard({ user }: { user: any }) {
  return (
    <div>
      <h1>Welcome, {user?.profile?.stxAddress?.mainnet || "Guest"}!</h1>
      <form method="POST" action="/api/logout">
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}
