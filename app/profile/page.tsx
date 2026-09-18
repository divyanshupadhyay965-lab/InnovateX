"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "../explore/components/Navbar";
import { type InnovateXProfile, getProfile } from "../../lib/profile";

const destinationCards = [
  { icon: "🧭", title: "Mission Roadmap", description: "Turn your career goal into weekly action.", href: "/roadmap" },
  { icon: "🎯", title: "Career Profile", description: "Map your strengths and interests.", href: "/career-engine" },
  { icon: "🚀", title: "Recommended Careers", description: "Explore your possible futures.", href: "/career-galaxy" },
  { icon: "🧭", title: "Missions", description: "Turn curiosity into real impact.", href: "/mission-control" },
  { icon: "🧘‍♂️", title: "Guru Ji", description: "Ask for a practical next step.", href: "/ai-mentor" },
];

function TagList({ items, emptyLabel }: { items: string[]; emptyLabel: string }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-1.5 text-xs font-semibold text-cyan-100">
          {item}
        </span>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<InnovateXProfile | null>(null);

  useEffect(() => {
    const storedProfile = getProfile();
    if (!storedProfile?.onboardingCompleted) {
      router.replace("/sign-in");
      return;
    }

    setProfile(storedProfile);
  }, [router]);

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#020617] text-white">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">Loading your universe...</div>
      </main>
    );
  }

  const education = [profile.educationLevel, profile.classOrYear].filter(Boolean).join(" • ");

  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] px-4 pb-10 pt-28 text-white md:px-6">
      <Navbar />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_16%_15%,rgba(34,211,238,0.16),transparent_23%),radial-gradient(circle_at_85%_20%,rgba(168,85,247,0.16),transparent_24%),radial-gradient(circle_at_55%_100%,rgba(37,99,235,0.15),transparent_31%)]" />

      <section className="relative mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.24em] text-cyan-300">YOUR INNOVATEX IDENTITY</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Your InnovateX Profile</h1>
            <p className="mt-2 text-sm text-slate-300">A foundation for the universe we&apos;ll personalise around you.</p>
          </div>
          <Link href="/onboarding" className="inline-flex items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-2.5 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/20">
            Edit Profile
          </Link>
        </motion.div>

        <div className="mt-7 grid gap-5 lg:grid-cols-[1.1fr_1.9fr]">
          <motion.aside initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }} className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-6 shadow-[0_0_55px_rgba(34,211,238,0.1)] backdrop-blur-2xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.3rem] border border-cyan-200/30 bg-gradient-to-br from-cyan-400/20 to-violet-500/25 text-3xl shadow-[0_0_28px_rgba(34,211,238,0.16)]">
              {profile.name.slice(0, 1).toUpperCase()}
            </div>
            <h2 className="mt-5 text-2xl font-black">{profile.name}</h2>
            <p className="mt-1 text-sm text-slate-400">{profile.email}</p>

            <div className="mt-7 border-t border-white/10 pt-5">
              <p className="text-[10px] font-bold tracking-[0.18em] text-slate-500">EDUCATION</p>
              <p className="mt-2 text-sm font-semibold text-white">{education || "Your path"}</p>
              {profile.field && <p className="mt-1 text-sm text-cyan-200">{profile.field}</p>}
            </div>

            <div className="mt-5 border-t border-white/10 pt-5">
              <p className="text-[10px] font-bold tracking-[0.18em] text-slate-500">GOALS</p>
              <div className="mt-3"><TagList items={profile.goals} emptyLabel="Add goals when you edit your profile." /></div>
            </div>
          </motion.aside>

          <div className="space-y-5">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-6 backdrop-blur-2xl">
              <p className="text-[10px] font-bold tracking-[0.18em] text-violet-300">CURIOSITY MAP</p>
              <h2 className="mt-2 text-xl font-black">Interests</h2>
              <div className="mt-4"><TagList items={[...profile.subjects, ...profile.interests]} emptyLabel="Add your interests to unlock recommendations." /></div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-6 backdrop-blur-2xl">
              <p className="text-[10px] font-bold tracking-[0.18em] text-cyan-300">STRENGTH SCAN</p>
              <h2 className="mt-2 text-xl font-black">Skills</h2>
              <div className="mt-4"><TagList items={profile.skills} emptyLabel="Add strengths to make your profile richer." /></div>
            </motion.div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="mt-5">
          <p className="mb-3 text-xs font-bold tracking-[0.18em] text-slate-400">YOUR NEXT DESTINATIONS</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {destinationCards.map((card) => (
              <Link key={card.title} href={card.href} className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:-translate-y-1 hover:border-cyan-300/35 hover:bg-cyan-300/[0.06]">
                <span className="text-2xl">{card.icon}</span>
                <h3 className="mt-3 font-bold text-white">{card.title}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-400">{card.description}</p>
                <p className="mt-3 text-xs font-bold text-cyan-300 transition group-hover:translate-x-1">Explore →</p>
              </Link>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
