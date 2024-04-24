"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Category,
  Setting,
  LogoutCurve,
  User,
  TableDocument,
} from "iconsax-react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { useAuthContext } from "@/app/context/auth-context";

const Sidebar = () => {
  const pathname = usePathname();
  const authData = useAuthContext();

  return (
    <div className="flex h-screen w-64 flex-col justify-between border-r border-gray-300 bg-primary p-6">
      <div>
        <div className="m-auto w-full pb-5">
          <Image
            src="/logo.png"
            alt="logo"
            width={80}
            height={80}
            className="mx-auto block rounded-lg"
          />
        </div>
        <ul>
          {authData?.role === "STAFF" ? (
            <Navlink
              title="Dashboard"
              href="/dashboard"
              icon={Category}
              active={pathname.startsWith("/dashboard")}
            />
          ) : (
            <Navlink
              title="Requests"
              href="/requests"
              icon={TableDocument}
              active={pathname.startsWith("/requests")}
            />
          )}
          <Navlink
            title="Settings"
            href="#"
            icon={Setting}
            active={pathname === "/settings"}
          />
          <Navlink
            title="Profile"
            href="#"
            icon={User}
            active={pathname === "/profile"}
          />
        </ul>
      </div>
      <Button
        variant="ghost"
        className="justify-start text-red-600 space-x-4"
        onClick={() => signOut({ callbackUrl: "/" })}
        size="lg"
      >
        <LogoutCurve size={24} className="text-red-600" variant="Outline" />
        <span>Logout</span>
      </Button>
    </div>
  );
};

function Navlink({
  href,
  title,
  active,
  icon: IconComponent,
}: {
  href: string;
  title: string;
  active: boolean;
  icon: typeof LogoutCurve;
}) {
  return (
    <li>
      <Link
        href={href}
        className={[
          "m-auto mt-4 flex w-full items-center gap-2 rounded-xl p-3 transition-all duration-200 ease-in-out",
          active
            ? "bg-primary-foreground"
            : "border-transparent hover:bg-[#46464740]",
        ].join(" ")}
      >
        <IconComponent
          size={24}
          color={active ? "#000000" : "#D1D5DB"}
          variant={active ? "Bulk" : "Outline"}
        />
        <span className={active ? "text-black" : "text-gray-300"}>{title}</span>
      </Link>
    </li>
  );
}

export default Sidebar;
