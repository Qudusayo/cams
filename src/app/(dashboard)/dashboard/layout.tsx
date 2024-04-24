"use client";

import { useParams } from "next/navigation";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();

  const isFormPage = Object.keys(params)[1] === "formId";

  return (
    <div className="flex h-full flex-col gap-4">
      {!isFormPage && (
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold">Requests</h2>
            <p>Submit cash advance request</p>
          </div>

          <div>
            <Link href={"/dashboard/new-request"}>
              <Button className="space-x-2">
                <Plus size={16} />
                <span>New Request</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
      <div
        className={clsx(
          "flex-1 rounded-2xl",
          isFormPage ? "bg-transparent p-0" : "bg-white p-4"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
