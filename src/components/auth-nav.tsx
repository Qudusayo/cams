"use client";

import { useAuthContext } from "@/app/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const AuthNav = () => {
  const authData = useAuthContext();

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3">
      <div className="leading-tight">
        <span className="text-sm">Welcome back</span>
        <h2 className="text-xl font-semibold">{authData!.name}</h2>
      </div>
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={authData!.profileImage} />
          <AvatarFallback>
            {authData!.name
              .split(" ")
              .map((name) => name[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default AuthNav;
