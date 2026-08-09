"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  return (
    <motion.nav
      initial={{
        opacity: 0,
        y: -30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.8,
      }}
      className="
        fixed
        top-6
        left-1/2
        z-50
        flex
        w-[90%]
        max-w-6xl
        -translate-x-1/2
        items-center
        justify-between
        rounded-full
        border
        border-white/10
        bg-black/30
        px-8
        py-4
        backdrop-blur-xl
      "
    >
      {/* LOGO */}

      <Link
        href="/"
        className="
          text-2xl
          font-black
          bg-gradient-to-r
          from-cyan-400
          to-purple-500
          bg-clip-text
          text-transparent
        "
      >
        InnovateX
      </Link>

      {/* NAVIGATION */}

      <div
        className="
          hidden
          items-center
          gap-8
          text-sm
          text-gray-300
          md:flex
        "
      >
        <Link
          href="/"
          className="transition hover:text-white"
        >
          Home
        </Link>

        <Link
          href="/explore"
          className="transition hover:text-white"
        >
          Career Engine
          <span className="ml-1 text-[10px] text-cyan-400">
            (BETA)
          </span>
        </Link>

        <Link
          href="/career-galaxy"
          className="transition hover:text-white"
        >
          Career Galaxy
        </Link>

        <Link
          href="/mission-control"
          className="transition hover:text-white"
        >
          Mission Control
        </Link>

        <Link
          href="/ai-mentor"
          className="transition hover:text-white"
        >
          AI Mentor
        </Link>
      </div>

      {/* SIGN IN */}

      <button
        type="button"
        className="
          rounded-full
          bg-gradient-to-r
          from-cyan-500
          to-purple-600
          px-6
          py-2
          text-sm
          font-bold
          transition
          hover:scale-105
        "
      >
        Sign In
      </button>
    </motion.nav>
  );
}