"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import CareerEngine from "./CareerEngine";
import CareerGalaxy from "./CareerGalaxy";
import MissionControl from "./MissionControl";

export default function ExploreUniverse() {
  const [mentor, setMentor] = useState("");

  return (
    <section className="relative z-10 space-y-32 px-6 py-20 text-white">

      {/* ================= INTRO ================= */}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-6xl text-center"
      >
        <p className="font-bold tracking-[0.45em] text-cyan-400">
          INNOVATEX UNIVERSE
        </p>

        <h2 className="mt-6 text-5xl font-black md:text-7xl">
          Explore Your Future 🌌
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-400">
          Discover careers, solve real-world problems and build
          the future with InnovateX.
        </p>
      </motion.div>


      {/* ================= 01 — AI CAREER ENGINE ================= */}

      <section>
        <CareerEngine />
      </section>


      {/* ================= 02 — CAREER GALAXY ================= */}

      <section className="mx-auto max-w-7xl">
        <CareerGalaxy />
      </section>


      {/* ================= 03 — MISSION CONTROL ================= */}

      <section className="mx-auto max-w-7xl">
        <MissionControl />
      </section>


      {/* ================= 04 — AI MENTOR ================= */}

      <section className="mx-auto max-w-5xl">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >

          <p className="text-center font-bold tracking-[0.35em] text-cyan-400">
            YOUR AI COMPANION
          </p>

          <h3 className="mt-4 text-center text-5xl font-black">
            AI Mentor 🧠
          </h3>

          <p className="mt-4 text-center text-gray-400">
            Your personal guide for careers, skills and innovation.
          </p>


          <div className="mt-10 rounded-3xl border border-cyan-400/20 bg-white/5 p-8 backdrop-blur-xl">

            <h4 className="text-3xl font-bold">
              🤖 InnovateX AI Assistant
            </h4>

            <p className="mt-3 text-gray-400">
              Ask anything about technology, careers or projects.
            </p>


            <input
              value={mentor}
              onChange={(event) => setMentor(event.target.value)}
              placeholder="Example: How can I become an AI engineer?"
              className="mt-6 w-full rounded-xl border border-white/10 bg-black/30 p-4 outline-none transition focus:border-cyan-400"
            />


            <div className="mt-6 rounded-xl bg-black/40 p-5 text-gray-300">

              {mentor
                ? `AI Mentor 🚀: Start by exploring ${mentor}. Build projects, practice consistently and keep improving.`
                : "Waiting for your question..."
              }

            </div>


            <div className="mt-8 flex flex-wrap gap-3">

              {[
                "Best STEM careers?",
                "How can I learn AI?",
                "Give me project ideas?",
              ].map((item) => (

                <button
                  key={item}
                  type="button"
                  onClick={() => setMentor(item)}
                  className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-2 text-sm transition hover:bg-cyan-400/20"
                >
                  {item}
                </button>

              ))}

            </div>

          </div>

        </motion.div>

      </section>


      {/* ================= FINAL CTA ================= */}

      <section className="pb-20 text-center">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >

          <h3 className="text-5xl font-black md:text-6xl">
            Build The Future 🚀
          </h3>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
            InnovateX is where imagination becomes innovation.
          </p>

          <button
            type="button"
            className="mt-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 px-10 py-4 text-lg font-bold transition hover:scale-105"
          >
            Start Innovating ✨
          </button>

        </motion.div>

      </section>

    </section>
  );
}