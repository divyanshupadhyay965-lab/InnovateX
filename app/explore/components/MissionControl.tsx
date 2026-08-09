"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { problemDatabase } from "../data/problemDatabase";

type Mission = {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  threat: number;
  difficulty: string;
  xp: number;
  impact: string;
  sdg: number;
  skills: string[];
  careers: string[];
  technologies: string[];
  ideas: string[];
  challenges: {
    level: string;
    title: string;
    reward: string;
  }[];
};

const filters = [
  "All",
  "Climate",
  "Healthcare",
  "Technology",
  "Space",
  "Environment",
];

export default function MissionControl() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const missions = useMemo(() => {
    return problemDatabase.filter((mission: Mission) => {
      const searchMatch =
        mission.title.toLowerCase().includes(search.toLowerCase()) ||
        mission.description.toLowerCase().includes(search.toLowerCase());

      const categoryMatch =
        category === "All" || mission.category === category;

      return searchMatch && categoryMatch;
    });
  }, [search, category]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#030712] text-white">

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,.08),transparent_60%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.45, 0.2],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
          }}
          className="absolute left-1/2 top-52 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[170px]"
        />

      </div>

      <div className="relative z-10">

        {/* Hero */}

        <div className="px-8 pt-24">

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center font-bold tracking-[0.45em] text-cyan-400"
          >
            GLOBAL INNOVATION COMMAND
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-center text-7xl font-black"
          >
            🚨 MISSION CONTROL
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mx-auto mt-8 max-w-4xl text-center text-lg leading-8 text-gray-400"
          >
            Solve humanity's greatest problems.
            Build revolutionary technology.
            Shape the future.
          </motion.p>

        </div>

        {/* Dashboard */}

        <div className="mx-auto mt-20 grid max-w-7xl gap-6 px-8 md:grid-cols-4">

          {[
            ["147", "MISSIONS"],
            ["08", "OMEGA"],
            ["24,531", "INNOVATORS"],
            ["98%", "GLOBAL RISK"],
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              className="rounded-3xl border border-cyan-500/20 bg-white/5 p-8 backdrop-blur-xl"
            >
              <h2 className="text-5xl font-black text-cyan-300">
                {item[0]}
              </h2>

              <p className="mt-4 tracking-[0.3em] text-gray-400">
                {item[1]}
              </p>
            </motion.div>
          ))}

        </div>
                {/* ================= SEARCH ================= */}

        <div className="mx-auto mt-20 max-w-6xl px-8">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl"
          >

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex-1">

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search missions..."
                  className="w-full rounded-2xl border border-cyan-500/20 bg-[#0b1220] px-6 py-4 text-white outline-none transition focus:border-cyan-400"
                />

              </div>

              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-6 py-4">

                <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
                  Missions Found
                </p>

                <h2 className="mt-2 text-3xl font-black text-cyan-300">
                  {missions.length}
                </h2>

              </div>

            </div>

          </motion.div>

        </div>

        {/* ================= FILTERS ================= */}

        <div className="mx-auto mt-10 flex max-w-7xl flex-wrap justify-center gap-4 px-8">

          {filters.map((filter) => (

            <motion.button
              key={filter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCategory(filter)}
              className={`rounded-full px-6 py-3 font-bold transition ${
                category === filter
                  ? "bg-cyan-400 text-black"
                  : "border border-white/10 bg-white/5 text-white hover:border-cyan-400/40"
              }`}
            >
              {filter}
            </motion.button>

          ))}

        </div>
                {/* ================= MISSION GRID ================= */}

        <div className="mx-auto mt-20 grid max-w-7xl gap-8 px-8 md:grid-cols-2 xl:grid-cols-3">

          {missions.map((mission, index) => (

            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{
                y: -12,
                scale: 1.02,
              }}
              className="group cursor-pointer overflow-hidden rounded-3xl border border-cyan-500/20 bg-white/5 backdrop-blur-xl"
              onClick={() => setSelectedMission(mission)}
            >

              {/* IMAGE */}

              <div className="relative overflow-hidden">

                <img
                  src={mission.image}
                  alt={mission.title}
                  className="h-64 w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-black/40 to-transparent" />

                <div className="absolute left-5 top-5 rounded-full bg-red-600 px-4 py-2 text-xs font-black tracking-[0.3em]">

                  MISSION-{String(index + 1).padStart(3, "0")}

                </div>

                <div className="absolute right-5 top-5 rounded-full bg-cyan-500/20 px-4 py-2 text-xs font-bold">

                  {mission.category}

                </div>

              </div>

              {/* CONTENT */}

              <div className="space-y-6 p-7">

                <div>

                  <h2 className="text-3xl font-black">

                    {mission.title}

                  </h2>

                  <p className="mt-4 line-clamp-3 leading-7 text-gray-400">

                    {mission.description}

                  </p>

                </div>

                {/* THREAT BAR */}

                <div>

                  <div className="mb-2 flex justify-between">

                    <span className="text-gray-400">

                      Threat Level

                    </span>

                    <span className="font-bold text-red-400">

                      {mission.threat}%

                    </span>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-white/10">

                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{
                        width: `${mission.threat}%`,
                      }}
                      transition={{ duration: 1 }}
                      className="h-full rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-300"
                    />

                  </div>

                </div>

                {/* STATS */}

                <div className="grid grid-cols-3 gap-3">

                  <div className="rounded-xl bg-cyan-500/10 p-3 text-center">

                    <p className="text-xs text-gray-400">

                      XP

                    </p>

                    <p className="font-black text-cyan-300">

                      {mission.xp}

                    </p>

                  </div>

                  <div className="rounded-xl bg-yellow-500/10 p-3 text-center">

                    <p className="text-xs text-gray-400">

                      Difficulty

                    </p>

                    <p className="font-black text-yellow-300">

                      {mission.difficulty}

                    </p>

                  </div>

                  <div className="rounded-xl bg-green-500/10 p-3 text-center">

                    <p className="text-xs text-gray-400">

                      SDG

                    </p>

                    <p className="font-black text-green-300">

                      {mission.sdg}

                    </p>

                  </div>

                </div>

                <button className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 py-4 text-lg font-black tracking-wider transition hover:scale-105">

                  BEGIN OPERATION →

                </button>

              </div>

            </motion.div>

          ))}

        </div>
        {/* ================= MISSION DOSSIER ================= */}

<AnimatePresence>

{selectedMission && (

<motion.div

initial={{ opacity:0 }}

animate={{ opacity:1 }}

exit={{ opacity:0 }}

className="fixed inset-0 z-[999] overflow-y-auto bg-black/90 backdrop-blur-xl"

>

<motion.div

initial={{ y:60, opacity:0 }}

animate={{ y:0, opacity:1 }}

exit={{ y:60, opacity:0 }}

transition={{ duration:.35 }}

className="min-h-screen"

>

{/* HERO */}

<div className="relative h-[420px] overflow-hidden">

<img

src={selectedMission.image}

alt={selectedMission.title}

className="h-full w-full object-cover"

/>

<div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-black/50 to-transparent"/>

<button

onClick={()=>setSelectedMission(null)}

className="absolute right-8 top-8 rounded-full bg-red-600 px-5 py-3 font-bold transition hover:bg-red-700"

>

✕

</button>

<div className="absolute bottom-12 left-12">

<p className="font-bold tracking-[0.4em] text-cyan-300">

CLASSIFIED DOSSIER

</p>

<h1 className="mt-4 text-6xl font-black">

{selectedMission.title}

</h1>

</div>

</div>

{/* BODY */}

<div className="mx-auto max-w-7xl space-y-10 px-10 py-12">

<div className="grid gap-6 md:grid-cols-4">

<div className="rounded-2xl bg-white/5 p-6">

<p className="text-gray-400">

Threat

</p>

<h2 className="mt-3 text-5xl font-black text-red-400">

{selectedMission.threat}%

</h2>

</div>

<div className="rounded-2xl bg-white/5 p-6">

<p className="text-gray-400">

Difficulty

</p>

<h2 className="mt-3 text-4xl font-black text-yellow-300">

{selectedMission.difficulty}

</h2>

</div>

<div className="rounded-2xl bg-white/5 p-6">

<p className="text-gray-400">

XP

</p>

<h2 className="mt-3 text-4xl font-black text-cyan-300">

{selectedMission.xp}

</h2>

</div>

<div className="rounded-2xl bg-white/5 p-6">

<p className="text-gray-400">

Impact

</p>

<h2 className="mt-3 text-4xl font-black text-green-300">

{selectedMission.impact}

</h2>

</div>

</div>

<div className="rounded-3xl bg-white/5 p-8">

<h2 className="mb-5 text-3xl font-black">

Mission Overview

</h2>

<p className="leading-8 text-gray-300">

{selectedMission.description}

</p>

</div>
{/* ================= SKILLS ================= */}

<div className="rounded-3xl bg-white/5 p-8">

  <h2 className="mb-6 text-3xl font-black text-cyan-300">
    Required Skills
  </h2>

  <div className="flex flex-wrap gap-4">

    {selectedMission.skills.map((skill) => (

      <span
        key={skill}
        className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-3 font-bold"
      >
        {skill}
      </span>

    ))}

  </div>

</div>

{/* ================= CAREERS ================= */}

<div className="rounded-3xl bg-white/5 p-8">

  <h2 className="mb-6 text-3xl font-black text-green-300">
    Recommended Careers
  </h2>

  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

    {selectedMission.careers.map((career) => (

      <div
        key={career}
        className="rounded-2xl border border-green-400/20 bg-green-500/10 p-6 text-center"
      >

        <div className="mb-3 text-5xl">
          💼
        </div>

        <h3 className="font-bold">
          {career}
        </h3>

      </div>

    ))}

  </div>

</div>

{/* ================= TECHNOLOGIES ================= */}

<div className="rounded-3xl bg-white/5 p-8">

  <h2 className="mb-6 text-3xl font-black text-purple-300">
    Technologies
  </h2>

  <div className="flex flex-wrap gap-4">

    {selectedMission.technologies.map((tech) => (

      <span
        key={tech}
        className="rounded-full border border-purple-400/20 bg-purple-500/10 px-5 py-3"
      >
        ⚙ {tech}
      </span>

    ))}

  </div>

</div>

{/* ================= INNOVATION IDEAS ================= */}

<div className="rounded-3xl bg-white/5 p-8">

  <h2 className="mb-6 text-3xl font-black text-yellow-300">
    Innovation Ideas
  </h2>

  <div className="grid gap-5 md:grid-cols-3">

    {selectedMission.ideas.map((idea) => (

      <div
        key={idea}
        className="rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-6"
      >

        <div className="mb-3 text-4xl">
          💡
        </div>

        <p className="leading-7">
          {idea}
        </p>

      </div>

    ))}

  </div>

</div>

{/* ================= CHALLENGES ================= */}

<div className="rounded-3xl bg-white/5 p-8">

  <h2 className="mb-6 text-3xl font-black text-red-300">
    Mission Challenges
  </h2>

  <div className="grid gap-6 lg:grid-cols-3">

    {selectedMission.challenges.map((challenge) => (

      <div
        key={challenge.title}
        className="rounded-2xl border border-red-400/20 bg-red-500/10 p-6"
      >

        <div className="mb-4 text-5xl">
          {challenge.level === "Beginner"
            ? "⚡"
            : challenge.level === "Advanced"
            ? "🚀"
            : "🌌"}
        </div>

        <h3 className="text-2xl font-black">
          {challenge.level}
        </h3>

        <p className="mt-4 text-gray-300">
          {challenge.title}
        </p>

        <div className="mt-6 inline-block rounded-full bg-white/10 px-4 py-2 font-bold text-cyan-300">
          {challenge.reward}
        </div>

      </div>

    ))}

  </div>

</div>
{/* ================= AI TERMINAL ================= */}

<div className="rounded-3xl border border-cyan-500/20 bg-[#050b18] p-8">

  <h2 className="mb-6 text-3xl font-black text-cyan-300">
    AI Mission Terminal
  </h2>

  <div className="space-y-3 rounded-2xl bg-black p-6 font-mono text-green-400">

    <p>&gt; Connecting to InnovateX Network...</p>
    <p>&gt; Access Level : OMEGA</p>
    <p>&gt; Mission Loaded Successfully</p>
    <p>&gt; Threat Level : {selectedMission.threat}%</p>
    <p>&gt; Recommended Careers : {selectedMission.careers.length}</p>
    <p>&gt; Required Skills : {selectedMission.skills.length}</p>
    <p>&gt; AI Confidence : 98.7%</p>

    <motion.p

      animate={{ opacity: [0.3, 1, 0.3] }}

      transition={{
        repeat: Infinity,
        duration: 1.2,
      }}

      className="text-cyan-300"

    >
      &gt; Awaiting Deployment...
    </motion.p>

  </div>

</div>

{/* ================= DEPLOY ================= */}

<div className="pb-20 text-center">

  <motion.button

    whileHover={{
      scale: 1.05,
      boxShadow: "0 0 50px rgba(34,211,238,.5)",
    }}

    whileTap={{ scale: 0.95 }}

    className="rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 px-16 py-6 text-2xl font-black tracking-[0.25em]"

  >

    🚀 DEPLOY MISSION

  </motion.button>

</div>

</div>

</motion.div>

</motion.div>

)}

</AnimatePresence>

</div>

</section>

);
}