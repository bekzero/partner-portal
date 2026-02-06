import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import SignInForm from "@/app/signin/signin-form";
import Image from "next/image";
import { authOptions } from "@/lib/auth";

export default async function SignInPage() {
  let session = null;
  
  try {
    session = await getServerSession(authOptions);
  } catch (e) {
    console.warn("Could not get session, continuing with signin");
  }
  
  if (session) redirect("/");

  return (
    <div className="min-h-dvh bg-black text-zinc-100 flex">
      <div className="hidden md:flex md:w-1/2 bg-zinc-900/50 border-r border-zinc-800 items-center justify-center p-12">
        <div className="max-w-md">
          <Image
            src="/logo_kzero-passwordless_horizontal-01WHITE.png"
            alt="KZero Logo"
            width={200}
            height={50}
            className="h-auto w-auto mb-8"
            priority
          />
          <h1 className="text-2xl font-semibold text-white mb-4">
            Partner Portal
          </h1>
          <p className="text-zinc-400 text-sm">
            Access battle cards, announcements, and resources for your partnership.
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="md:hidden mb-8">
            <Image
              src="/logo_kzero-passwordless_horizontal-01WHITE.png"
              alt="KZero Logo"
              width={150}
              height={38}
              className="h-auto w-auto"
              priority
            />
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">Welcome back</h1>
          <p className="text-sm text-zinc-400 mb-6">Sign in to access your account</p>
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
