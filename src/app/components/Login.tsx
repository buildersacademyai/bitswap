"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const ConnectButton = dynamic(
  () => import("@stacks/connect").then((mod) => mod.showConnect),
  { ssr: false }
);

export default function Login() {
  const [loading, setLoading] = useState(false);

  const authenticate = async () => {
    setLoading(true);

    ConnectButton({
      onFinish: () => {
        console.log("User authenticated");
        setLoading(false);
      },
      userSession: new (await import("@stacks/connect")).UserSession({
        appConfig: new (await import("@stacks/connect")).AppConfig(["store_write"]),
      }),
    });
  };

  return (
    <button onClick={authenticate} disabled={loading}>
      {loading ? "Connecting..." : "Sign in with Stacks"}
    </button>
  );
}
