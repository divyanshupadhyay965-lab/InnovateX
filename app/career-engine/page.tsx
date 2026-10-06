"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../explore/components/Navbar";
import { type RoadmapCareer } from "../../lib/roadmap";

type Stage = "fields" | "questioning" | "analysing" | "results" | "details";

type Question = {
  id: string;
  question: string;
  subtitle: string;
  options: string[];
};

type Career = {
  name: string;
  match: number;
  description: string;
  reason: string;
  skills: string[];
  future: string;
};

function careerOverview(career: Career) {
  const skills = career.skills.length ? career.skills : ["Problem solving", "Communication", "Curiosity"];
  return {
    work: `Use ${skills.slice(0, 2).join(" and ")} to solve real problems, collaborate with others, and turn ideas into outcomes.`,
    subjects: skills.slice(0, 3).concat(["Communication"]),
    education: `Build a strong foundation through relevant school subjects, courses, hands-on projects, and mentorship. Progress into specialised study or experience as your interests become clearer.`,
    specializations: [`Applied ${career.name}`, `${career.name} strategy`, `${career.name} research`],
    environment: "Teams, studios, labs, offices, or hybrid settings — the exact environment depends on your speciality and employer.",
    advantages: "Meaningful problem-solving, transferable skills, and opportunities to keep learning as the field evolves.",
    challenges: "Requires steady practice, feedback, and resilience while you build expertise and a visible body of work.",
    progression: `Explore → build foundations → create projects → specialise → grow into a trusted ${career.name} professional.`,
    related: ["Product Manager", "Researcher", "Consultant"],
  };
}

const fields = [
  "🤖 Technology & AI",
  "🩺 Medicine & Healthcare",
  "🦾 Engineering & Robotics",
  "🚀 Space & Aviation",
  "💼 Business & Entrepreneurship",
  "🔬 Science & Research",
  "⚖️ Law & Public Service",
  "🎨 Design & Media",
  "🌱 Environment & Sustainability",
  "🧠 Psychology & Human Behaviour",
];

const analysisSteps = [
  "Reading your interests",
  "Mapping your strengths",
  "Analysing your preferences",
  "Finding career patterns",
  "Calculating compatibility",
];


function getRoadmapCareer(career: Career): RoadmapCareer | null {
  const name = career.name.toLowerCase().trim();

  if (
    name.includes("ai engineer") ||
    name.includes("artificial intelligence") ||
    name.includes("machine learning")
  ) {
    return {
      id: "ai-engineer",
      title: "AI Engineer",
      description:
        "Build mathematical, programming, and AI skills to create intelligent systems.",
      focusSkills: [
        "Mathematics",
        "Python",
        "Machine Learning",
        "Problem Solving",
      ],
    };
  }

  if (
    name.includes("entrepreneur") ||
    name.includes("startup") ||
    name.includes("business")
  ) {
    return {
      id: "entrepreneur",
      title: "Entrepreneur",
      description:
        "Learn to identify problems, validate ideas, and build products people value.",
      focusSkills: [
        "Communication",
        "Market Research",
        "Business",
        "Leadership",
      ],
    };
  }

  if (
    name.includes("aerospace") ||
    name.includes("aeronautical") ||
    name.includes("space engineer")
  ) {
    return {
      id: "aerospace-engineer",
      title: "Aerospace Engineer",
      description:
        "Develop the science, engineering, and systems thinking behind flight and space technology.",
      focusSkills: [
        "Physics",
        "Mathematics",
        "Engineering",
        "Design",
      ],
    };
  }

  if (
    name === "doctor" ||
    name.includes("medical") ||
    name.includes("physician") ||
    name.includes("medicine")
  ) {
    return {
      id: "doctor",
      title: "Doctor",
      description:
        "Build a strong science foundation and develop the empathy and discipline needed for healthcare.",
      focusSkills: [
        "Biology",
        "Chemistry",
        "Research",
        "Communication",
      ],
    };
  }

  if (
    name.includes("researcher") ||
    name.includes("research scientist") ||
    name.includes("scientist")
  ) {
    return {
      id: "researcher",
      title: "Researcher",
      description:
        "Turn curiosity into rigorous questions, evidence, and meaningful discoveries.",
      focusSkills: [
        "Research",
        "Analysis",
        "Writing",
        "Problem Solving",
      ],
    };
  }

  if (
    name.includes("technology") ||
    name.includes("software") ||
    name.includes("developer") ||
    name.includes("programmer")
  ) {
    return {
      id: "technology-builder",
      title: "Technology Builder",
      description:
        "Use technical skills and curiosity to build useful digital products and solutions.",
      focusSkills: [
        "Coding",
        "Design",
        "Problem Solving",
        "Projects",
      ],
    };
  }

  return null;
}

export default function CareerEnginePage() {
  const router = useRouter();

  const [stage, setStage] = useState<Stage>("fields");

  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [customField, setCustomField] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>(
    {}
  );

  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [error, setError] = useState("");

  const question = questions[currentQuestion];

  const selectedAnswers = question
    ? answers[question.id] || []
    : [];

  const customAnswer = question
    ? customAnswers[question.id] || ""
    : "";

  function toggleField(field: string) {
    setSelectedFields((previous) =>
      previous.includes(field)
        ? previous.filter((item) => item !== field)
        : [...previous, field]
    );
  }

  async function continueFromFields() {
    if (
      selectedFields.length === 0 &&
      customField.trim() === ""
    ) {
      return;
    }

    setError("");

    try {
      const response = await fetch("/api/career/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedFields,
          customField,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to generate questions."
        );
      }

      if (
        !Array.isArray(data?.questions) ||
        data.questions.length !== 4
      ) {
        throw new Error("AI returned invalid questions.");
      }

      setQuestions(data.questions);
      setCurrentQuestion(0);
      setStage("questioning");
    } catch (error: any) {
      console.error(
        "Question generation error:",
        error
      );

      setError(
        error?.message ||
          "Could not generate career questions."
      );
    }
  }

  function toggleOption(option: string) {
    if (!question) return;

    setAnswers((previous) => {
      const current = previous[question.id] || [];

      const updated = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];

      return {
        ...previous,
        [question.id]: updated,
      };
    });
  }

  function updateCustomAnswer(value: string) {
    if (!question) return;

    setCustomAnswers((previous) => ({
      ...previous,
      [question.id]: value,
    }));
  }

  function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
    }
  }

  function previousQuestion() {
    if (currentQuestion > 0) {
      setCurrentQuestion((previous) => previous - 1);
    } else {
      setStage("fields");
    }
  }

  function openCareerDetails(career: Career) {
    setError("");
    setSelectedCareer(career);
    setStage("details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function exploreRoadmap() {
    // Roadmap intentionally asks the user to choose a career itself.
    // The Career Engine only provides the detailed career review.
    router.push("/roadmap");
  }

  async function startAnalysis() {
    setStage("analysing");
    setAnalysisProgress(0);
    setError("");

    let progress = 0;

    const progressInterval = setInterval(() => {
      progress += 2;

      setAnalysisProgress(Math.min(progress, 100));

      if (progress >= 100) {
        clearInterval(progressInterval);
      }
    }, 80);

    try {
      const response = await fetch("/api/career", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedFields,
          customField,
          answers,
          customAnswers,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Career analysis failed."
        );
      }

      if (
        !data?.careers ||
        !Array.isArray(data.careers)
      ) {
        throw new Error(
          "The AI returned an invalid career response."
        );
      }

      setCareers(data.careers);

      setTimeout(() => {
        setStage("results");
      }, 900);
    } catch (err: any) {
      console.error("Career Engine Error:", err);

      clearInterval(progressInterval);

      setError(
        err?.message ||
          "Something went wrong while analysing your career."
      );

      setTimeout(() => {
        setStage("questioning");
      }, 1200);
    }
  }

  const questionProgress =
    questions.length > 0
      ? ((currentQuestion + 1) / questions.length) * 100
      : 0;

  const currentAnalysisStep = Math.min(
    Math.floor(analysisProgress / 20),
    analysisSteps.length - 1
  );

    return (
  <>
    <Navbar />

    <main className="min-h-screen bg-[#020617] text-white">
      <section
        id="career-engine"
        className="relative z-10 mx-auto min-h-screen max-w-6xl px-6 py-24"
      >
        <AnimatePresence mode="wait">

          {/* STEP 1 — FIELD SELECTION */}

          {stage === "fields" && (
            <motion.div
              key="fields"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.96,
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="mx-auto max-w-4xl text-center">
                <p className="font-bold tracking-[0.4em] text-cyan-400">
                  STEP 01
                </p>

                <h2 className="mt-5 text-5xl font-black md:text-7xl">
                  What sparks your curiosity?
                </h2>

                <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-400">
                  Select one or more fields that genuinely
                  interest you. Don't worry about choosing
                  the perfect career yet.
                </p>
              </div>

              <div className="mx-auto mt-14 max-w-5xl">
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-10">

                  <div className="grid gap-4 md:grid-cols-2">
                    {fields.map((field) => {
                      const selected =
                        selectedFields.includes(field);

                      return (
                        <motion.button
                          key={field}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleField(field)}
                          className={`rounded-2xl border p-6 text-left font-bold transition ${
                            selected
                              ? "border-cyan-400 bg-cyan-400/15 text-cyan-300 shadow-lg shadow-cyan-500/10"
                              : "border-white/10 bg-white/5 text-gray-200 hover:border-cyan-400/40 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-lg">
                              {field}
                            </span>

                            <span
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm ${
                                selected
                                  ? "border-cyan-400 bg-cyan-400 text-black"
                                  : "border-white/20 text-transparent"
                              }`}
                            >
                              ✓
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="mt-8 rounded-2xl border border-purple-400/20 bg-purple-500/5 p-6">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✨</span>

                      <div>
                        <h3 className="font-bold text-purple-300">
                          Can't find your field?
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Tell InnovateX what you're interested in.
                        </p>
                      </div>
                    </div>

                    <input
                      value={customField}
                      onChange={(event) =>
                        setCustomField(event.target.value)
                      }
                      placeholder="e.g. Architecture, Sports, Finance..."
                      className="mt-5 w-full rounded-xl border border-white/10 bg-black/20 p-4 text-white outline-none placeholder:text-gray-600 focus:border-purple-400"
                    />
                  </div>

                  <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-500">
                      {selectedFields.length > 0
                        ? `${selectedFields.length} field${
                            selectedFields.length === 1
                              ? ""
                              : "s"
                          } selected`
                        : customField.trim()
                        ? "Custom field added"
                        : "Select at least one field"}
                    </p>

                    <button
                      type="button"
                      disabled={
                        selectedFields.length === 0 &&
                        customField.trim() === ""
                      }
                      onClick={continueFromFields}
                      className="rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-9 py-4 font-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      Continue →
                    </button>
                  </div>

                  {error && (
                    <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-center text-red-300">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2 — QUESTIONING */}

          {stage === "questioning" && question && (
            <motion.div
              key="questioning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                scale: 0.96,
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="mx-auto max-w-4xl text-center">
                <p className="font-bold tracking-[0.4em] text-cyan-400">
                  STEP 02
                </p>

                <h2 className="mt-5 text-5xl font-black md:text-7xl">
                  AI Career DNA 🤖
                </h2>

                <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-400">
                  Now let's understand how you think,
                  learn and work.
                </p>
              </div>

              <div className="mx-auto mt-14 max-w-4xl">
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-10">

                  <div className="mb-10">
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="font-bold text-cyan-400">
                        QUESTION{" "}
                        {String(currentQuestion + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <span className="text-gray-500">
                        {String(questions.length).padStart(
                          2,
                          "0"
                        )}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        animate={{
                          width: `${questionProgress}%`,
                        }}
                        transition={{ duration: 0.4 }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
                      />
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={question.id}
                      initial={{
                        opacity: 0,
                        x: 40,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      exit={{
                        opacity: 0,
                        x: -40,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-3xl font-black md:text-5xl">
                        {question.question}
                      </h3>

                      <p className="mt-4 text-gray-400">
                        {question.subtitle}
                      </p>

                      <div className="mt-8 grid gap-4 md:grid-cols-2">
                        {question.options.map((option) => {
                          const selected =
                            selectedAnswers.includes(option);

                          return (
                            <motion.button
                              key={option}
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                toggleOption(option)
                              }
                              className={`rounded-2xl border p-5 text-left font-bold transition ${
                                selected
                                  ? "border-cyan-400 bg-cyan-400/15 text-cyan-300"
                                  : "border-white/10 bg-white/5 hover:border-cyan-400/40 hover:bg-white/10"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-4">
                                <span>{option}</span>

                                <span
                                  className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                                    selected
                                      ? "border-cyan-400 bg-cyan-400 text-black"
                                      : "border-white/20"
                                  }`}
                                >
                                  {selected ? "✓" : ""}
                                </span>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>

                      <div className="mt-8 rounded-2xl border border-purple-400/20 bg-purple-500/5 p-5">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">✨</span>

                          <h4 className="font-bold text-purple-300">
                            Something else?
                          </h4>
                        </div>

                        <textarea
                          value={customAnswer}
                          onChange={(event) =>
                            updateCustomAnswer(
                              event.target.value
                            )
                          }
                          placeholder="Tell InnovateX anything else..."
                          rows={3}
                          className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-black/20 p-4 text-white outline-none placeholder:text-gray-600 focus:border-purple-400"
                        />
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-10 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={previousQuestion}
                      className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-bold hover:bg-white/10"
                    >
                      ← Back
                    </button>

                    {currentQuestion < questions.length - 1 ? (
                      <button
                        type="button"
                        onClick={nextQuestion}
                        className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 font-black transition hover:scale-105"
                      >
                        Next →
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={startAnalysis}
                        className="rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 px-8 py-3 font-black transition hover:scale-105"
                      >
                        Analyze My Career DNA 🚀
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ANALYSING */}

          {stage === "analysing" && (
            <motion.div
              key="analysing"
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{ duration: 0.6 }}
              className="flex min-h-[700px] items-center justify-center"
            >
              <div className="w-full max-w-4xl">

                <div className="relative mx-auto flex h-72 w-72 items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.15, 1],
                      opacity: [0.25, 0.5, 0.25],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.5,
                    }}
                    className="absolute inset-0 rounded-full bg-cyan-500/10 blur-3xl"
                  />

                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: "linear",
                    }}
                    className="absolute inset-5 rounded-full border border-cyan-400/20 border-t-cyan-400"
                  />

                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 6,
                      ease: "linear",
                    }}
                    className="absolute inset-12 rounded-full border border-purple-400/20 border-b-purple-400"
                  />

                  <div className="relative text-center">
                    <div className="text-7xl font-black text-cyan-300">
                      {analysisProgress}%
                    </div>

                    <p className="mt-3 text-sm font-bold tracking-[0.3em] text-gray-500">
                      ANALYSING
                    </p>
                  </div>
                </div>

                <div className="mt-12 text-center">
                  <p className="font-bold tracking-[0.4em] text-cyan-400">
                    CAREER ENGINE
                  </p>

                  <h2 className="mt-4 text-4xl font-black md:text-6xl">
                    Analysing Your Career DNA
                  </h2>

                  <p className="mx-auto mt-5 max-w-2xl text-gray-400">
                    Connecting your interests, strengths
                    and preferences to possible career paths.
                  </p>
                </div>

                <div className="mx-auto mt-12 max-w-2xl space-y-4">
                  {analysisSteps.map((step, index) => {
                    const completed =
                      analysisProgress >=
                      (index + 1) * 20;

                    const active =
                      index === currentAnalysisStep &&
                      analysisProgress < 100;

                    return (
                      <div
                        key={step}
                        className={`flex items-center gap-4 rounded-2xl border p-5 ${
                          completed
                            ? "border-cyan-400/30 bg-cyan-400/10"
                            : active
                            ? "border-purple-400/30 bg-purple-400/10"
                            : "border-white/10 bg-white/5"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full font-black ${
                            completed
                              ? "bg-cyan-400 text-black"
                              : active
                              ? "bg-purple-400 text-black"
                              : "bg-white/10 text-gray-500"
                          }`}
                        >
                          {completed ? "✓" : index + 1}
                        </div>

                        <span className="font-bold">
                          {step}
                        </span>

                        {active && (
                          <span className="ml-auto text-purple-300">
                            ...
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {error && (
                  <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-red-400/20 bg-red-500/10 p-5 text-center text-red-300">
                    {error}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* CAREER DETAILS */}

          {stage === "details" && selectedCareer && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mx-auto max-w-5xl">
                <button
                  type="button"
                  onClick={() => setStage("results")}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-3 font-bold text-gray-300 transition hover:bg-white/10"
                >
                  ← Back to Career Results
                </button>

                <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-7 backdrop-blur-xl md:p-10">
                  <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
                    <div className="max-w-3xl">
                      <p className="font-bold tracking-[0.4em] text-cyan-400">
                        CAREER DEEP DIVE
                      </p>
                      <h2 className="mt-4 text-5xl font-black md:text-7xl">
                        {selectedCareer.name}
                      </h2>
                      <p className="mt-5 text-lg leading-8 text-gray-300">
                        {selectedCareer.description}
                      </p>
                    </div>

                    <div className="shrink-0 text-center">
                      <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-8 border-cyan-400/20">
                        <div
                          className="absolute inset-0 rounded-full border-8 border-transparent border-t-cyan-400 border-r-purple-500"
                          style={{ transform: `rotate(${Math.max(0, Math.min(100, selectedCareer.match)) * 3.6}deg)` }}
                        />
                        <div>
                          <div className="text-4xl font-black text-cyan-300">
                            {selectedCareer.match}%
                          </div>
                          <p className="text-xs font-bold tracking-widest text-gray-500">
                            MATCH
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 grid gap-6 md:grid-cols-2">
                    <div className="rounded-3xl border border-cyan-400/10 bg-cyan-400/5 p-6">
                      <p className="text-xs font-bold tracking-[0.25em] text-cyan-400">
                        WHY IT MATCHES YOU
                      </p>
                      <p className="mt-4 leading-8 text-gray-300">
                        {selectedCareer.reason}
                      </p>
                    </div>

                    <div className="rounded-3xl border border-purple-400/10 bg-purple-500/5 p-6">
                      <p className="text-xs font-bold tracking-[0.25em] text-purple-300">
                        FUTURE POTENTIAL
                      </p>
                      <p className="mt-4 leading-8 text-gray-300">
                        {selectedCareer.future}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-6">
                    <p className="text-xs font-bold tracking-[0.25em] text-gray-500">
                      SKILL PROFILE
                    </p>
                    <div className="mt-5 space-y-4">
                      {selectedCareer.skills.map((skill, index) => (
                        <div key={skill}>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="font-bold text-gray-200">{skill}</span>
                            <span className="text-sm text-gray-500">Core skill {index + 1}</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.max(35, Math.min(95, selectedCareer.match - index * 6))}%` }}
                              transition={{ duration: 0.8, delay: index * 0.08 }}
                              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 grid gap-5 md:grid-cols-2">
                    {(() => { const overview = careerOverview(selectedCareer); return <>
                      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"><p className="text-xs font-bold tracking-[0.2em] text-cyan-300">WHAT PROFESSIONALS DO</p><p className="mt-3 leading-7 text-gray-300">{overview.work}</p><p className="mt-5 text-xs font-bold tracking-[0.2em] text-cyan-300">WORK ENVIRONMENT</p><p className="mt-3 leading-7 text-gray-300">{overview.environment}</p></div>
                      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"><p className="text-xs font-bold tracking-[0.2em] text-purple-300">EDUCATION & PATHWAY</p><p className="mt-3 leading-7 text-gray-300">{overview.education}</p><p className="mt-5 text-xs font-bold tracking-[0.2em] text-purple-300">RECOMMENDED SUBJECTS</p><div className="mt-3 flex flex-wrap gap-2">{overview.subjects.map((subject) => <span key={subject} className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-gray-200">{subject}</span>)}</div></div>
                      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"><p className="text-xs font-bold tracking-[0.2em] text-cyan-300">SPECIALIZATIONS & RELATED CAREERS</p><div className="mt-3 flex flex-wrap gap-2">{[...overview.specializations, ...overview.related].map((item) => <span key={item} className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-sm text-cyan-100">{item}</span>)}</div><p className="mt-5 text-xs font-bold tracking-[0.2em] text-cyan-300">CAREER PROGRESSION</p><p className="mt-3 leading-7 text-gray-300">{overview.progression}</p></div>
                      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"><p className="text-xs font-bold tracking-[0.2em] text-emerald-300">ADVANTAGES</p><p className="mt-3 leading-7 text-gray-300">{overview.advantages}</p><p className="mt-5 text-xs font-bold tracking-[0.2em] text-amber-300">CHALLENGES</p><p className="mt-3 leading-7 text-gray-300">{overview.challenges}</p></div>
                    </>; })()}
                  </div>

                  <div className="mt-10 rounded-[2rem] border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-7 text-center md:p-10">
                    <p className="text-2xl font-black md:text-3xl">
                      Want to choose this career for yourself?
                    </p>
                    <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-400">
                      Explore the Roadmap tab to get detailed guidance and a personalized journey toward this career.
                    </p>
                    <button
                      type="button"
                      onClick={exploreRoadmap}
                      className="mt-7 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 px-10 py-4 font-black tracking-wider transition hover:scale-105"
                    >
                      EXPLORE ROADMAP →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* RESULTS */}

          {stage === "results" && (
            <motion.div
              key="results"
              initial={{
                opacity: 0,
                y: 40,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{ duration: 0.7 }}
            >
              <div className="mx-auto max-w-4xl text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan-400 text-4xl text-black shadow-lg shadow-cyan-500/30">
                  ✓
                </div>

                <p className="mt-8 font-bold tracking-[0.4em] text-cyan-400">
                  CAREER DNA COMPLETE
                </p>

                <h2 className="mt-4 text-5xl font-black md:text-7xl">
                  Your Career Galaxy 🌌
                </h2>

                <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-400">
                  InnovateX discovered career paths that
                  could fit you.
                </p>
              </div>

              <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-2">
                {careers.map((career, index) => (
                  <motion.div
                    key={`${career.name}-${index}`}
                    initial={{
                      opacity: 0,
                      y: 40,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.12,
                    }}
                    whileHover={{ y: -8 }}
                    className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl hover:border-cyan-400/40"
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <p className="text-sm font-bold tracking-[0.25em] text-gray-500">
                          MATCH #{index + 1}
                        </p>

                        <h3 className="mt-2 text-3xl font-black">
                          {career.name}
                        </h3>
                      </div>

                      <div className="text-right">
                        <div className="text-4xl font-black text-cyan-300">
                          {career.match}%
                        </div>

                        <p className="text-xs font-bold text-gray-500">
                          MATCH
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${career.match}%`,
                        }}
                        transition={{ duration: 1 }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
                      />
                    </div>

                    <p className="mt-6 leading-7 text-gray-300">
                      {career.description}
                    </p>

                    <div className="mt-6 rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-5">
                      <p className="text-xs font-bold tracking-[0.2em] text-cyan-400">
                        WHY IT MATCHES YOU
                      </p>

                      <p className="mt-3 leading-7 text-gray-400">
                        {career.reason}
                      </p>
                    </div>

                    <div className="mt-6">
                      <p className="text-xs font-bold tracking-[0.2em] text-gray-500">
                        CORE SKILLS
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {career.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="text-xs font-bold tracking-[0.2em] text-gray-500">
                        FUTURE POTENTIAL
                      </p>

                      <p className="mt-2 leading-7 text-gray-400">
                        {career.future}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => openCareerDetails(career)}
                      className="mt-7 w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 py-4 font-black tracking-wider transition hover:scale-[1.02]"
                    >
                      EXPLORE CAREER →
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStage("fields");
                    setSelectedFields([]);
                    setCustomField("");
                    setCurrentQuestion(0);
                    setQuestions([]);
                    setCareers([]);
                    setSelectedCareer(null);
                    setAnswers({});
                    setCustomAnswers({});
                    setAnalysisProgress(0);
                    setError("");
                  }}
                  className="rounded-full border border-white/10 bg-white/5 px-7 py-3 font-bold text-gray-300 transition hover:bg-white/10"
                >
                  ↻ Start Again
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </section>
      </main>
  </>
);
}
