"use client";

import { useParams } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const isRequestPage = Object.keys(params)[0] === "request-id";

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-semibold">Requests</h2>
          <p>Review cash advance request</p>
        </div>
      </div>

      <div className="flex-1 rounded-2xl bg-white p-4">{children}</div>
    </div>
  );
};

export default Layout;
