
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  type InnovateXProfile,
  PROFILE_UPDATED_EVENT,
  getProfile,
  signOutDemoUser,
} from "../../../lib/profile";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Explore", href: "/explore" },
  { name: "Career Engine", href: "/career-engine" },
  { name: "Career Galaxy", href: "/career-galaxy" },
  { name: "Mission Control", href: "/mission-control" },
  { name: "AI Mentor", href: "/ai-mentor" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<InnovateXProfile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function syncProfile() {
      setProfile(getProfile());
    }

    syncProfile();
    window.addEventListener(PROFILE_UPDATED_EVENT, syncProfile);
    window.addEventListener("storage", syncProfile);

    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, syncProfile);
      window.removeEventListener("storage", syncProfile);
    };
  }, []);

  function handleSignOut() {
    signOutDemoUser();
    setMenuOpen(false);
    router.push("/sign-in");
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="
        fixed
        top-4
        left-1/2
        z-[9999]
        w-[96%]
        max-w-7xl
        -translate-x-1/2
        rounded-2xl
        border
        border-white/10
        bg-[#030712]/90
        px-4
        py-3
        shadow-[0_0_35px_rgba(34,211,238,0.12)]
        backdrop-blur-xl
      "
    >
      <div className="flex items-center gap-4">

        {/* LOGO */}

        <Link
          href="/"
          className="
            shrink-0
            text-xl
            font-black
            tracking-tight
            text-white
            transition-transform
            hover:scale-105
            md:text-2xl
          "
        >
          Innovate<span className="text-cyan-400">X</span>
        </Link>

        {/* NAVIGATION */}

        <div
          className="
            flex
            min-w-0
            flex-1
            items-center
            justify-start
            gap-1
            overflow-x-auto
          "
        >
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className="
                  relative
                  shrink-0
                  rounded-xl
                  px-3
                  py-2
                  text-sm
                  font-semibold
                  text-gray-300
                  transition-all
                  duration-200
                  hover:text-white
                  md:px-4
                "
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavbar"
                    className="
                      absolute
                      inset-0
                      rounded-xl
                      border
                      border-cyan-400/30
                      bg-cyan-400/10
                    "
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}

                <span
                  className={`relative z-10 ${
                    isActive
                      ? "font-bold text-cyan-300"
                      : "text-gray-300"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* ONLINE */}

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <motion.div
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              h-2
              w-2
              rounded-full
              bg-cyan-400
              shadow-[0_0_12px_rgba(34,211,238,1)]
            "
          />

          <span className="text-xs font-bold tracking-wider text-gray-300">
            ONLINE
          </span>
        </div>

        <div className="relative shrink-0">
          {profile?.onboardingCompleted ? (
            <>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Open profile menu"
                aria-expanded={menuOpen}
                className="flex items-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-300/[0.08] px-2 py-1.5 text-sm font-bold text-cyan-50 transition hover:border-cyan-300/50 hover:bg-cyan-300/[0.15]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-300 to-violet-400 text-xs font-black text-slate-950">
                  {profile.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden max-w-24 truncate sm:inline">{profile.name.split(" ")[0]}</span>
                <span className="text-xs text-cyan-200">⌄</span>
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 top-[calc(100%+0.65rem)] w-48 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 p-1.5 shadow-[0_18px_45px_rgba(0,0,0,0.45)] backdrop-blur-xl"
                  >
                    <Link href="/profile" onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-cyan-300/10 hover:text-cyan-100">
                      Profile
                    </Link>
                    <Link href="/onboarding" onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-cyan-300/10 hover:text-cyan-100">
                      Edit Profile
                    </Link>
                    <div className="my-1 border-t border-white/10" />
                    <button type="button" onClick={handleSignOut} className="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-300 transition hover:bg-rose-400/10 hover:text-rose-200">
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <Link href="/sign-in" className="rounded-xl border border-cyan-300/25 bg-cyan-300/[0.08] px-3 py-2 text-xs font-bold text-cyan-100 transition hover:border-cyan-300/50 hover:bg-cyan-300/[0.15] sm:px-4 sm:text-sm">
              <span className="hidden sm:inline">Sign In </span>→
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
