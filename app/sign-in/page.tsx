"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "../explore/components/Navbar";
import { getProfile, saveDemoUser } from "../../lib/profile";

export default function SignInPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (getProfile()?.onboardingCompleted) {
      router.replace("/profile");
    }
  }, [router]);

  function continueToOnboarding(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail) return;

    saveDemoUser({ name: trimmedName, email: trimmedEmail });
    router.push("/onboarding");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] px-4 pb-10 pt-28 text-white md:px-6">
      <Navbar />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.16),transparent_26%),radial-gradient(circle_at_82%_15%,rgba(168,85,247,0.15),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.14),transparent_32%)]" />

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative mx-auto w-full max-w-md"
      >
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-6 shadow-[0_0_70px_rgba(34,211,238,0.12)] backdrop-blur-2xl sm:p-8">
          <div className="mb-7">
            <div className="mb-4 inline-flex rounded-2xl border border-cyan-300/25 bg-cyan-300/10 p-3 text-2xl shadow-[0_0_26px_rgba(34,211,238,0.16)]">
              ✦
            </div>
            <p className="text-xs font-bold tracking-[0.24em] text-cyan-300">WELCOME TO INNOVATEX</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight">Start your journey</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Create a lightweight demo profile to unlock a personalised InnovateX universe.
            </p>
          </div>

          <form onSubmit={continueToOnboarding} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-bold tracking-wide text-slate-300">YOUR NAME</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                placeholder="What should we call you?"
                className="w-full rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:bg-cyan-300/[0.04]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold tracking-wide text-slate-300">EMAIL</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:bg-cyan-300/[0.04]"
              />
            </label>

            <motion.button
              type="submit"
              disabled={!name.trim() || !email.trim()}
              whileHover={name.trim() && email.trim() ? { scale: 1.02 } : undefined}
              whileTap={name.trim() && email.trim() ? { scale: 0.98 } : undefined}
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 px-5 py-3.5 text-sm font-black text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.24)] transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sign In / Sign Up →
            </motion.button>
          </form>

          <p className="mt-5 text-center text-xs leading-5 text-slate-500">
            Demo only: your profile is stored locally in this browser. No password or real authentication is used.
          </p>
        </div>
      </motion.section>
    </main>
  );
}
