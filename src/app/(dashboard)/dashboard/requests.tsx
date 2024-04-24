import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { formatMoney } from "@/lib/utils";
import { RequestRow } from "@/components/request-row";

async function getRequests(userId: string) {
  const res = await prisma.form.findMany({
    where: {
      ownerId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res;
}

export async function Requests() {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email as string },
  });

  if (!user || !user.id) {
    return redirect("/");
  }

  const requests = await getRequests(user.id);

  if (!requests) {
    return redirect("/dashboard");
  }

  return (
    <Table>
      <TableCaption>A list of your filled requests.</TableCaption>
      <TableHeader>
        <TableRow className="hover:!bg-transparent">
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <RequestRow route="dashboard" key={request.id} request={request} />
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell colSpan={4}>
            {formatMoney(requests.reduce((acc, curr) => acc + curr.amount, 0))}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
