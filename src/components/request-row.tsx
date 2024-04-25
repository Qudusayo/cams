"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { cn, formatMoney, getDueDate } from "@/lib/utils";
import moment from "moment";
import { Badge } from "./ui/badge";
import { Form } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Dot } from "lucide-react";
import { FormStatus } from "@prisma/client";

export const statusView: Record<FormStatus, string> = {
  SUBMITTED: "Submitted",
  HODENDORSED: "HOD Endorsed",
  BURSERENDORSED: "Bursar Endorsed",
  BURSERAPPROVED: "Bursar Approved",
  LOANADVANCED: "Approved",
  REJECTED: "Rejected",
};

export const RequestRow = ({
  request,
  route,
}: {
  request: Form;
  route: "requests" | "dashboard";
}) => {
  const dueDays = getDueDate(request.dateToRetireAdvance);

  const { push } = useRouter();
  const index = request.requestNo.toString().padStart(3, "0");

  return (
    <TableRow
      key={request.id}
      className="cursor-pointer"
      onClick={() => push(`/${route}/${request.id}`)}
    >
      <TableCell className="font-medium">REQ#{index}</TableCell>
      <TableCell>{formatMoney(request.amount)}</TableCell>
      <TableCell>
        {moment(request.createdAt).format("MMMM Do YYYY, h:mm a")}
      </TableCell>
      <TableCell className="space-x-2">
        <span>
          {moment(request.dateToRetireAdvance).format("MMMM Do YYYY, h:mm a")}
        </span>
        <Badge className="bg-black">
          {dueDays > 0 ? `Due in ${dueDays} days` : `${+dueDays} days overdue`}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <Badge
          variant="outline"
          className={cn(
            "relative pl-5 uppercase",
            request.status === "REJECTED"
              ? "text-red-500"
              : request.status === "LOANADVANCED"
              ? "text-green-500"
              : "text-blue-500"
          )}
        >
          <Dot size={50} className="absolute -left-4" />
          <span>{statusView[request.status]}</span>
        </Badge>
      </TableCell>
    </TableRow>
  );
};
