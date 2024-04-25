import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Request from "../../requests/[request-id]/request";

async function getFormData(requestId: string) {
  const formData = await prisma.form.findUnique({
    where: {
      id: requestId,
    },
    include: {
      statuses: {
        include: {
          updatedBy: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return formData;
}

const page = async ({ params }: { params: { "request-id": string } }) => {
  const requestId = params["request-id"];

  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email as string },
  });

  if (!user || !user.id) {
    return redirect("/");
  }

  const formData = await getFormData(requestId);

  if (!formData) {
    return redirect("/requests");
  }

  return (
    <div>
      <Request formData={formData} viewOnly />
    </div>
  );
};

export default page;
