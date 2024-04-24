"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Google } from "iconsax-react";

const AuthButton = () => {
  const { push } = useRouter();
  const { data: session, status } = useSession();

  const handleSignIn = () => {
    if (session) {
      push("/dashboard");
    } else {
      signIn("google", {
        callbackUrl: "/dashboard",
      });
    }
  };

  return (
    <Button
      className="rounded-full space-x-3 text-lg p-6"
      onClick={handleSignIn}
      disabled={status === "loading"}
    >
      {!session && status !== "loading" && <Google size="32" color="#FFF" />}
      <span>{session ? "Go to Dashboard" : "Login to Continue"}</span>
    </Button>
  );
};

export default AuthButton;
