"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { formatMoney, getDueDate } from "@/lib/utils";
import moment from "moment";
import { Badge } from "./ui/badge";
import { Form } from "@prisma/client";
import { useRouter } from "next/navigation";

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
      <TableCell className="text-right">{request.status}</TableCell>
    </TableRow>
  );
};
