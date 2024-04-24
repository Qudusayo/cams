"use server";

import { z } from "zod";
import { prisma } from "./db";
import { FormSchema } from "./constant";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { FormStatus } from "@prisma/client";
import { redirect } from "next/navigation";

export async function fileRequest(data: z.infer<typeof FormSchema>) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return {
        message: "Unauthenticated",
      };
    }

    const formData = FormSchema.safeParse(data);

    if (!formData.success) {
      return {
        errors: formData.error.flatten().fieldErrors,
      };
    }

    const owner = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!owner) {
      return {
        message: "Unauthorized",
      };
    }

    const newRequest = await prisma.form.create({
      data: {
        ...formData.data,
        amount: parseFloat(formData.data.amount),
        salaryPerAnnum: parseFloat(formData.data.salaryPerAnnum),
        owner: {
          connect: {
            id: owner.id,
          },
        },
      },
    });

    if (!newRequest) {
      return {
        errors: {
          server: "Failed to file a new request",
        },
      };
    }

    revalidatePath("/dashboard");

    return {
      request: newRequest,
      created: true,
    };
  } catch (error) {
    console.log(error);
    return {
      errors: {
        message:
          "An error occurred trying to file a new request. Please try again later.",
      },
    };
  }
}

export async function updateRequest(formId: string, status: FormStatus) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return {
        message: "Unauthenticated",
      };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return redirect("/");
    }

    const formRequest = await prisma.form.findUnique({
      where: { id: formId },
    });

    if (!formRequest) {
      return {
        message: "Form not found",
      };
    }

    const updatedRequest = await prisma.form.update({
      where: {
        id: formId,
      },
      data: {
        status,
        statuses: {
          create: {
            status,
            userId: user.id,
          },
        },
      },
    });

    if (!updatedRequest) {
      return {
        errors: {
          server: "Failed to update the current request",
        },
      };
    }

    revalidatePath("/dashboard");

    return {
      request: updatedRequest,
      created: true,
    };
  } catch (error) {
    console.log(error);
    return {
      errors: {
        message:
          "An error occurred trying to file a new request. Please try again later.",
      },
    };
  }
}
