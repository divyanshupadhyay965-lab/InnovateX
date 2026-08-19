"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { careerDatabase } from "../explore/data/careerDatabase";
import { careerImages, categoryImages } from "../explore/data/careerImages";
import Navbar from "../explore/components/Navbar";
const categories = [
  "All",
  "Technology",
  "Engineering",
  "Medical",
  "Business",
  "Science",
  "Research",
  "Creative",
  "Government",
  "Space",
];

export default function CareerGalaxyPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedCareer, setSelectedCareer] = useState<any>(null);
  const [showAll, setShowAll] = useState(false);

  const filteredCareers = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    const results = careerDatabase.filter((career: any) => {
      const matchesSearch =
        career.title?.toLowerCase().includes(searchText) ||
        career.category?.toLowerCase().includes(searchText) ||
        career.skills?.some((skill: string) =>
          skill.toLowerCase().includes(searchText)
        );

      const matchesCategory =
        category === "All" || career.category === category;

      return matchesSearch && matchesCategory;
    });

    return Array.from(
      new Map(
        results.map((career: any) => [
          career.title,
          career,
        ])
      ).values()
    );
  }, [search, category]);

  return (
   <>
    <Navbar />

    <main className="min-h-screen bg-[#020617] text-white">
      <section className="relative px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-center font-bold tracking-[0.4em] text-cyan-400">
            INNOVATEX UNIVERSE
          </p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="mt-5 text-center text-5xl font-black md:text-7xl"
          >
            Career Galaxy 🌌
          </motion.h1>

          <p className="mx-auto mt-5 max-w-2xl text-center text-gray-400">
            Search hundreds of careers and discover your future.
          </p>
        </motion.div>

        {/* SEARCH */}

        <div className="mx-auto mt-10 max-w-4xl">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowAll(false);
            }}
            placeholder="Search careers..."
            className="w-full rounded-full border border-cyan-400/20 bg-white/10 px-6 py-4 text-white outline-none placeholder:text-gray-500 focus:border-cyan-400"
          />
        </div>

        {/* CATEGORIES */}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setCategory(item);
                setShowAll(false);
              }}
              className={`rounded-full border px-5 py-2 transition ${
                category === item
                  ? "border-cyan-400 bg-cyan-500 text-white"
                  : "border-white/20 bg-white/10 hover:border-cyan-400/50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* COUNT */}

        <p className="mt-8 text-center text-gray-400">
          Showing{" "}
          <span className="font-bold text-cyan-400">
            {filteredCareers.length}
          </span>{" "}
          careers
        </p>

        {/* CAREER CARDS */}

        <div className="mx-auto mt-14 grid max-w-7xl gap-8 md:grid-cols-2 xl:grid-cols-3">
          {(showAll
            ? filteredCareers
            : filteredCareers.slice(0, 3)
          ).map((career: any) => (
            <motion.div
              key={career.id || career.title}
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              whileHover={{
                scale: 1.04,
                y: -8,
              }}
              transition={{
                duration: 0.3,
              }}
              onClick={() => setSelectedCareer(career)}
              className="
                cursor-pointer
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-white/5
                backdrop-blur-xl
                hover:border-cyan-400/40
              "
            >
              {/* IMAGE */}

              <div className="relative h-56 overflow-hidden">
                <img
                  src={
                    careerImages[career.title] ||
                    career.image ||
                    categoryImages[career.category] ||
                    `https://source.unsplash.com/800x600/?${encodeURIComponent(
                      career.title
                    )}`
                  }
                  alt={career.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                <div className="absolute bottom-5 left-5">
                  <h3 className="text-2xl font-black">
                    {career.title}
                  </h3>

                  <p className="text-sm text-cyan-300">
                    {career.category}
                  </p>
                </div>
              </div>

              {/* DETAILS */}

              <div className="p-6">
                <p className="line-clamp-3 text-sm text-gray-400">
                  {career.description}
                </p>

                {/* FUTURE SCORE */}

                <div className="mt-6">
                  <div className="flex justify-between text-sm">
                    <span>Future Score</span>

                    <span className="font-bold text-cyan-400">
                      {career.futureScore}/10
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-600"
                      style={{
                        width: `${career.futureScore * 10}%`,
                      }}
                    />
                  </div>
                </div>

                {/* STATS */}

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-black/20 p-4">
                    <p className="text-xs text-gray-400">
                      Demand
                    </p>

                    <p className="mt-1 font-bold">
                      {career.demand}
                    </p>
                  </div>

                  <div className="rounded-xl bg-black/20 p-4">
                    <p className="text-xs text-gray-400">
                      Difficulty
                    </p>

                    <p className="mt-1 font-bold">
                      {career.difficulty}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCareer(career);
                  }}
                  className="
                    mt-6
                    w-full
                    rounded-full
                    bg-gradient-to-r
                    from-cyan-500
                    to-purple-600
                    py-3
                    font-bold
                    transition
                    hover:scale-[1.02]
                  "
                >
                  Explore Career →
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* NO RESULTS */}

        {filteredCareers.length === 0 && (
          <div className="mt-16 text-center">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
              <p className="text-4xl">🔭</p>

              <h3 className="mt-5 text-2xl font-black">
                No careers found
              </h3>

              <p className="mt-3 text-gray-400">
                Try searching for another career or category.
              </p>
            </div>
          </div>
        )}

        {/* SHOW MORE */}

        {filteredCareers.length > 3 && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="
                rounded-full
                bg-gradient-to-r
                from-cyan-500
                to-purple-600
                px-8
                py-3
                font-bold
                transition
                hover:scale-105
              "
            >
              {showAll
                ? "Show Less ↑"
                : "Explore More Careers →"}
            </button>
          </div>
        )}

        {/* ================= MODAL ================= */}

        <AnimatePresence>
          {selectedCareer && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() => setSelectedCareer(null)}
              className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/80
                p-6
                backdrop-blur-sm
              "
            >
              <motion.div
                initial={{
                  scale: 0.85,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                exit={{
                  scale: 0.85,
                  opacity: 0,
                }}
                onClick={(e) => e.stopPropagation()}
                className="
                  max-h-[90vh]
                  w-full
                  max-w-4xl
                  overflow-y-auto
                  rounded-3xl
                  border
                  border-cyan-400/20
                  bg-[#071426]
                  p-8
                "
              >
                {/* HEADER */}

                <div className="flex items-center justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-black md:text-4xl">
                      {selectedCareer.title}
                    </h2>

                    <p className="mt-2 text-cyan-300">
                      {selectedCareer.category}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedCareer(null)}
                    className="text-4xl leading-none text-gray-400 transition hover:text-white"
                  >
                    ×
                  </button>
                </div>

                <p className="mt-8 leading-7 text-gray-300">
                  {selectedCareer.description}
                </p>

                {/* SCORE CARDS */}

                <div className="mt-10 grid gap-5 md:grid-cols-3">
                  <div className="rounded-2xl bg-cyan-500/10 p-5">
                    <p className="text-gray-400">
                      Future Score
                    </p>

                    <h3 className="text-3xl font-black text-cyan-400">
                      {selectedCareer.futureScore}/10
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-purple-500/10 p-5">
                    <p className="text-gray-400">
                      Demand
                    </p>

                    <h3 className="text-2xl font-bold">
                      {selectedCareer.demand}
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-5">
                    <p className="text-gray-400">
                      Difficulty
                    </p>

                    <h3 className="text-2xl font-bold">
                      {selectedCareer.difficulty}
                    </h3>
                  </div>
                </div>

                {/* SKILLS */}

                <h3 className="mt-12 text-3xl font-bold">
                  Skills Required 🚀
                </h3>

                <div className="mt-5 flex flex-wrap gap-3">
                  {selectedCareer.skills?.map(
                    (skill: string) => (
                      <span
                        key={skill}
                        className="
                          rounded-full
                          bg-cyan-500/20
                          px-5
                          py-2
                        "
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>

                {/* ROADMAP */}

                <h3 className="mt-12 text-3xl font-bold">
                  Learning Roadmap 🛣️
                </h3>

                <div className="mt-5 space-y-4">
                  {selectedCareer.roadmap?.map(
                    (
                      step: string,
                      index: number
                    ) => (
                      <div
                        key={`${step}-${index}`}
                        className="
                          rounded-2xl
                          border
                          border-white/10
                          bg-white/5
                          p-5
                        "
                      >
                        <p className="font-bold text-cyan-400">
                          Step {index + 1}
                        </p>

                        <p className="mt-2 text-gray-300">
                          {step}
                        </p>
                      </div>
                    )
                  )}
                </div>

                {/* EXTRA INFORMATION */}

                <div className="mt-12 grid gap-6 md:grid-cols-2">
                  <div
                    className="
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/5
                      p-6
                    "
                  >
                    <h3 className="text-2xl font-bold text-cyan-300">
                      🌍 Best Countries
                    </h3>

                    <p className="mt-4 text-gray-300">
                      USA • Canada • Germany • Japan •
                      Singapore • UK
                    </p>
                  </div>

                  <div
                    className="
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/5
                      p-6
                    "
                  >
                    <h3 className="text-2xl font-bold text-purple-300">
                      🏢 Top Companies
                    </h3>

                    <p className="mt-4 text-gray-300">
                      Google • Microsoft • NVIDIA • SpaceX •
                      Tesla • Apple
                    </p>
                  </div>
                </div>

                <div
                  className="
                    mt-8
                    rounded-3xl
                    border
                    border-white/10
                    bg-gradient-to-r
                    from-cyan-500/20
                    to-purple-500/20
                    p-6
                  "
                >
                  <h3 className="text-2xl font-bold">
                    🎓 Recommended Universities
                  </h3>

                  <p className="mt-4 text-gray-300">
                    MIT • Stanford • IIT Bombay • IIT Delhi •
                    Carnegie Mellon
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
        </main>
  </>
);
}