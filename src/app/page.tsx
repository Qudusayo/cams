import Image from "next/image";
import AuthButton from "@/components/auth-button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="bg-primary fixed top-0 w-full text-center text-white text-base py-2">
        Kindly login using your school email address (@stu.ui.edu.ng)
      </div>
      <div className="flex place-items-center">
        <div className="space-y-8">
          <h2 className="text-7xl capitalize text-balance">
            Cash Advance Management
          </h2>
          <p className="text-3xl text-balance">
            Streamline and Automate cash advance processes within organizations
          </p>
          <AuthButton />
        </div>
        <Image
          src="/illustration.svg"
          alt="Illustration"
          className="dark:invert"
          width={600}
          height={24}
          priority
        />
      </div>
    </main>
  );
}
