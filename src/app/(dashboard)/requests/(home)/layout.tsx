"use client";

import { useParams } from "next/navigation";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const isRequestPage = Object.keys(params)[0] === "request-id";

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-semibold">Requests</h2>
          <p>Submit cash advance request</p>
        </div>

        {isRequestPage && (
          <div className="space-x-4">
            <Button className="space-x-2">
              <span>Reject Request</span>
            </Button>
            <Button className="space-x-2">
              <span>Approve Request</span>
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 rounded-2xl bg-white p-4">{children}</div>
    </div>
  );
};

export default Layout;
