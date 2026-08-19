"use client";

import { motion } from "framer-motion";

import Background from "./components/Background";
import Navbar from "./components/Navbar";
import ExploreUniverse from "./components/ExploreUniverse";

export default function ExplorePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      <Background />

      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 pt-16"
      >
        <section className="flex min-h-[45vh] items-center justify-center px-6 text-center">
          <div>
            <p className="font-bold tracking-[0.4em] text-cyan-400">
              CAREER ENGINE
            </p>

            <h1 className="mt-5 text-5xl font-black md:text-8xl">
              Discover Your
              <br />

              <span className="bg-gradient-to-r from-cyan-300 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Future 🚀
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-lg text-gray-300">
              Discover careers based on your interests, skills and goals.
            </p>
          </div>
        </section>

        <ExploreUniverse />

        <div className="h-20" />
      </motion.div>
    </main>
  );
}