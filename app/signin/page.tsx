import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import SignInForm from "@/app/signin/signin-form";
import { ShieldCheck, Lock, ArrowRight } from "lucide-react";
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
    <div className="min-h-dvh bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,140,50,0.1),transparent_50%),radial-gradient(1000px_circle_at_20%_10%,rgba(255,255,255,0.03),transparent_45%)] bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl items-center justify-center px-6 py-12">
        <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-950/80 shadow-2xl backdrop-blur-xl md:grid-cols-2">
          <div className="relative hidden border-r border-zinc-800/60 bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 p-10 md:block">
            <div className="absolute inset-0 bg-[data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+] opacity-50" />

            <div className="relative z-10">
              <div className="mb-8">
                <Image
                  src="/logo_kzero-passwordless_horizontal-01WHITE.png"
                  alt="KZero Logo"
                  width={200}
                  height={50}
                  className="h-auto w-auto"
                  priority
                />
              </div>

              <div className="mt-4">
                <h2 className="text-2xl font-semibold leading-tight text-white">
                  Passwordless authentication for MSPs and MSSSs
                </h2>
                <p className="mt-4 text-sm text-zinc-300">
                  Access your partner enablement resources, battle cards, and the latest updates.
                </p>
              </div>

              <div className="mt-10 space-y-4">
                <div className="flex items-start gap-3 rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                    <Lock className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Passwordless Security</div>
                    <div className="mt-1 text-xs text-zinc-400">
                      Built on FIDO standards with biometric authentication
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                    <ShieldCheck className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Partner Exclusives</div>
                    <div className="mt-1 text-xs text-zinc-400">
                      Battle cards, sales enablement, and marketing resources
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex items-center gap-2 text-xs text-zinc-400">
                <span className="text-[#F85c3a]">Powered by: KZero Passwordless</span>
              </div>
            </div>
          </div>

          <div className="relative p-8 md:p-12">
            <div className="flex justify-end mb-4">
              <Image
                src="/dark-favicon.png"
                alt="KZero"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <div className="flex items-center gap-3 md:hidden">
              <Image
                src="/logo_kzero-passwordless_horizontal-01WHITE.png"
                alt="KZero Logo"
                width={150}
                height={38}
                className="h-auto w-auto"
              />
            </div>

            <div className="mt-8 md:mt-0">
              <div className="mb-2">
                <h1 className="text-2xl font-semibold tracking-tight text-white">Welcome back</h1>
                <p className="mt-1 text-sm text-zinc-400">
                  Sign in to access your partner resources
                </p>
              </div>

              <SignInForm />

              <div className="mt-6 flex items-center justify-between text-xs text-zinc-400">
                <a href="https://www.kzero.com/contact/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Need access?
                </a>
                <a href="https://www.kzero.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                  Learn about KZero <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
