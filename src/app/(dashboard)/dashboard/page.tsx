import { getServerSession } from "next-auth";
import { Requests } from "./requests";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return redirect("/");
  }

  if (session.user.role !== "STAFF") {
    redirect("/requests")
  }

  return (
    <div>
      <Requests />
    </div>
  );
};

export default Dashboard;
