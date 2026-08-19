"use client";

import { motion } from "framer-motion";

const news = [
  {
    tag: "TECH",
    title: "AI Is Changing How Students Build Their Future",
    description:
      "From coding copilots to intelligent learning tools, artificial intelligence is creating entirely new opportunities for the next generation.",
    date: "LATEST UPDATE",
    icon: "🤖",
  },
  {
    tag: "SPACE",
    title: "The New Space Race Needs Young Innovators",
    description:
      "Private companies, governments and research teams are pushing deeper into space — opening exciting paths in engineering and science.",
    date: "UNIVERSE NEWS",
    icon: "🚀",
  },
  {
    tag: "CLIMATE",
    title: "Innovation Could Be Our Strongest Climate Solution",
    description:
      "Clean energy, sustainable technology and creative problem-solving are becoming essential in solving global environmental challenges.",
    date: "GLOBAL UPDATE",
    icon: "🌍",
  },
];

const bulletins = [
  {
    title: "Mission Control Is Online",
    description:
      "Explore real-world problems and discover where your ideas could make an impact.",
    status: "ACTIVE",
  },
  {
    title: "New STEM Opportunities Incoming",
    description:
      "InnovateX is expanding its universe of careers, skills and future technologies.",
    status: "TRANSMITTING",
  },
  {
    title: "Community Signal Detected",
    description:
      "The future gets stronger when young innovators share ideas and build together.",
    status: "CONNECTED",
  },
];

export default function ExploreUniverse() {
  return (
    <section className="relative overflow-hidden bg-[#030712] px-6 py-24 text-white">
      {/* Background glow */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-[10%] h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="absolute bottom-[5%] right-[5%] h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[160px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:55px_55px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ================= COMMUNITY NEWS ================= */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="font-bold tracking-[0.4em] text-cyan-400">
            LIVE FROM THE UNIVERSE
          </p>

          <h2 className="mt-5 text-5xl font-black md:text-7xl">
            Community{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              News
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-400">
            Discover what&apos;s happening across technology, science,
            innovation and the future.
          </p>
        </motion.div>

        {/* News Cards */}

        <div className="mt-16 grid gap-7 md:grid-cols-3">
          {news.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              whileHover={{
                y: -10,
                scale: 1.02,
              }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl"
            >
              {/* Glow */}

              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl transition group-hover:bg-cyan-500/20" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-3xl">
                    {item.icon}
                  </div>

                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-xs font-bold text-cyan-300">
                    {item.tag}
                  </span>
                </div>

                <h3 className="mt-8 text-2xl font-black leading-tight">
                  {item.title}
                </h3>

                <p className="mt-5 leading-7 text-gray-400">
                  {item.description}
                </p>

                <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-xs font-bold tracking-wider text-gray-500">
                    {item.date}
                  </span>

                  <span className="text-cyan-400 transition group-hover:translate-x-2">
                    →
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* ================= BULLETINS ================= */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32"
        >
          <div className="text-center">
            <p className="font-bold tracking-[0.4em] text-purple-400">
              INNOVATEX NETWORK
            </p>

            <h2 className="mt-5 text-5xl font-black md:text-7xl">
              Latest{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Bulletins
              </span>
            </h2>
          </div>

          <div className="mx-auto mt-14 max-w-5xl space-y-5">
            {bulletins.map((bulletin, index) => (
              <motion.div
                key={bulletin.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  x: 8,
                }}
                className="flex flex-col gap-6 rounded-3xl border border-purple-500/20 bg-purple-500/[0.04] p-7 backdrop-blur-xl md:flex-row md:items-center"
              >
                {/* Status light */}

                <div className="flex shrink-0 items-center gap-3">
                  <motion.div
                    animate={{
                      opacity: [0.4, 1, 0.4],
                      scale: [0.9, 1.15, 0.9],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="h-3 w-3 rounded-full bg-purple-400 shadow-[0_0_20px_rgba(192,132,252,1)]"
                  />

                  <span className="text-xs font-black tracking-[0.2em] text-purple-300">
                    {bulletin.status}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-black">
                    {bulletin.title}
                  </h3>

                  <p className="mt-2 leading-7 text-gray-400">
                    {bulletin.description}
                  </p>
                </div>

                <div className="text-2xl text-purple-400">◉</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ================= ABOUT US ================= */}

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative mt-32 overflow-hidden rounded-[2rem] border border-cyan-500/20 bg-gradient-to-br from-cyan-500/[0.08] via-blue-500/[0.05] to-purple-600/[0.08] p-8 md:p-16"
        >
          {/* Background glows */}

          <div className="absolute -left-32 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-cyan-500/15 blur-[100px]" />

          <div className="absolute -right-32 top-0 h-80 w-80 rounded-full bg-purple-600/15 blur-[100px]" />

          <div className="relative z-10 grid items-center gap-12 md:grid-cols-2">
            <div>
              <p className="font-bold tracking-[0.4em] text-cyan-400">
                ABOUT INNOVATEX
              </p>

              <h2 className="mt-6 text-5xl font-black leading-tight md:text-6xl">
                The future isn&apos;t waiting.
                <br />
                <span className="text-cyan-300">Neither are we.</span>
              </h2>
            </div>

            <div>
              <p className="text-lg leading-8 text-gray-300">
                InnovateX is a platform built for curious minds who want to
                explore technology, understand future opportunities and turn
                bold ideas into meaningful innovation.
              </p>

              <p className="mt-5 leading-8 text-gray-400">
                We believe students shouldn&apos;t just be told what careers
                exist. They should be able to explore possibilities, understand
                global problems and discover where their skills can make a real
                difference.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                {[
                  "🚀 Explore",
                  "💡 Innovate",
                  "🌍 Impact",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-5 py-3 font-bold"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final Signal */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-24 text-center"
        >
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="mx-auto h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_30px_rgba(34,211,238,1)]"
          />

          <p className="mt-6 font-bold tracking-[0.35em] text-gray-500">
            END OF TRANSMISSION • MORE SIGNALS COMING SOON
          </p>
        </motion.div>
      </div>
    </section>
  );
}