
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Stage =
  | "fields"
  | "questioning"
  | "analysing"
  | "results";

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
const careerQuestions: Question[] = [
  {
    id: "work-style",
    question: "How do you like to solve problems?",
    subtitle: "There is no right answer — choose what feels most natural.",
    options: [
      "Build or create something",
      "Analyse data and find patterns",
      "Help and understand people",
      "Lead and make decisions",
    ],
  },
  {
    id: "learning-style",
    question: "What kind of learning excites you most?",
    subtitle: "Think about the subjects or activities you naturally enjoy.",
    options: [
      "Experiments and hands-on projects",
      "Math, logic and problem solving",
      "Reading, discussion and ideas",
      "Design, creativity and storytelling",
    ],
  },
  {
    id: "environment",
    question: "Where would you enjoy working?",
    subtitle: "Imagine your ideal future work environment.",
    options: [
      "Technology lab or computer setup",
      "Hospital, clinic or research facility",
      "Office or business environment",
      "Workshop, field or engineering environment",
    ],
  },
  {
    id: "motivation",
    question: "What motivates you the most?",
    subtitle: "Choose the outcome that would make your work feel meaningful.",
    options: [
      "Creating new technology",
      "Solving difficult problems",
      "Making a difference in people's lives",
      "Building something successful",
    ],
  },
  {
    id: "future",
    question: "What kind of future sounds most exciting?",
    subtitle: "Pick the direction that sparks your curiosity.",
    options: [
      "AI, robotics and emerging technology",
      "Science, medicine and discovery",
      "Business, leadership and entrepreneurship",
      "Space, engineering and exploration",
    ],
  },
];

export default function CareerEngine() {
  const [stage, setStage] = useState<Stage>("fields");

  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [customField, setCustomField] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState(0);
 const [questions, setQuestions] =
  useState<Question[]>([]);

  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [customAnswers, setCustomAnswers] =
    useState<Record<string, string>>({});

  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [careers, setCareers] = useState<Career[]>([]);
  const [error, setError] = useState("");
const question = questions[currentQuestion];

const selectedAnswers = question
  ? answers[question.id] || []
  : [];

const customAnswer = question
  ? customAnswers[question.id] || ""
  : "";

  /* ================================
     FIELD SELECTION
  ================================= */

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
    const response = await fetch(
      "/api/career/questions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedFields,
          customField,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error ||
          "Failed to generate questions."
      );
    }

    if (
      !Array.isArray(data?.questions) ||
      data.questions.length !== 4
    ) {
      throw new Error(
        "AI returned invalid questions."
      );
    }

    // 🔥 Store the NEW AI-generated questions
    setQuestions(data.questions);

    // Start from question 1
    setCurrentQuestion(0);

    // Show questioning screen
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
  /* ================================
     QUESTION ANSWERS
  ================================= */

  function toggleOption(option: string) {
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

  /* ================================
     AI CAREER ANALYSIS
  ================================= */

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
    ((currentQuestion + 1) / questions.length) * 100;

  const currentAnalysisStep = Math.min(
    Math.floor(analysisProgress / 20),
    analysisSteps.length - 1
  );

  /* =========================================
     UI
  ========================================= */

  return (
    <section
      id="career-engine"
      className="relative z-10 mx-auto min-h-screen max-w-6xl px-6 py-24 text-white"
    >
      <AnimatePresence mode="wait">

        {/* =====================================
            STEP 1 — FIELD SELECTION
        ===================================== */}

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
                        whileHover={{
                          scale: 1.02,
                        }}
                        whileTap={{
                          scale: 0.98,
                        }}
                        onClick={() =>
                          toggleField(field)
                        }
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

                {/* CUSTOM FIELD */}

                <div className="mt-8 rounded-2xl border border-purple-400/20 bg-purple-500/5 p-6">

                  <div className="flex items-center gap-3">

                    <span className="text-2xl">
                      ✨
                    </span>

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

                {/* SELECTED COUNT */}

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

              </div>

            </div>
          </motion.div>
        )}

        {/* =====================================
            QUESTIONING
        ===================================== */}
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

                {/* PROGRESS */}

                <div className="mb-10">

                  <div className="mb-3 flex items-center justify-between text-sm">

                    <span className="font-bold text-cyan-400">
                      QUESTION{" "}
                      {String(
                        currentQuestion + 1
                      ).padStart(2, "0")}
                    </span>

                    <span className="text-gray-500">
                      {String(
                        questions.length
                      ).padStart(2, "0")}
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/10">

                    <motion.div
                      animate={{
                        width: `${questionProgress}%`,
                      }}
                      transition={{
                        duration: 0.4,
                      }}
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
                    transition={{
                      duration: 0.3,
                    }}
                  >

                    <h3 className="text-3xl font-black md:text-5xl">
                      {question?.question}
                    </h3>

                    <p className="mt-4 text-gray-400">
                      {question?.subtitle}
                    </p>

                    <div className="mt-8 grid gap-4 md:grid-cols-2">

                      {question?.options?.map(
                        (option) => {

                          const selected =
                            selectedAnswers.includes(
                              option
                            );

                          return (
                            <motion.button
                              key={option}
                              type="button"
                              whileHover={{
                                scale: 1.02,
                              }}
                              whileTap={{
                                scale: 0.98,
                              }}
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

                                <span>
                                  {option}
                                </span>

                                <span
                                  className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                                    selected
                                      ? "border-cyan-400 bg-cyan-400 text-black"
                                      : "border-white/20"
                                  }`}
                                >
                                  {selected
                                    ? "✓"
                                    : ""}
                                </span>

                              </div>

                            </motion.button>
                          );
                        }
                      )}

                    </div>

                    {/* CUSTOM ANSWER */}

                    <div className="mt-8 rounded-2xl border border-purple-400/20 bg-purple-500/5 p-5">

                      <div className="flex items-center gap-2">

                        <span className="text-xl">
                          ✨
                        </span>

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

                {/* NAVIGATION */}

                <div className="mt-10 flex items-center justify-between gap-4">

                  <button
                    type="button"
                    onClick={previousQuestion}
                    className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-bold hover:bg-white/10"
                  >
                    ← Back
                  </button>

                  {currentQuestion <
                  questions.length - 1 ? (

                    <button
                      type="button"
                      onClick={nextQuestion}
                      className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 font-black hover:scale-105"
                    >
                      Next →
                    </button>

                  ) : (

                    <button
                      type="button"
                      onClick={startAnalysis}
                      className="rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 px-8 py-3 font-black hover:scale-105"
                    >
                      Analyze My Career DNA 🚀
                    </button>

                  )}

                </div>

              </div>

            </div>

          </motion.div>
        )}

        {/* =====================================
            ANALYSING
        ===================================== */}

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

                {analysisSteps.map(
                  (step, index) => {

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
                          {completed
                            ? "✓"
                            : index + 1}
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
                  }
                )}

              </div>

              {error && (
                <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-red-400/20 bg-red-500/10 p-5 text-center text-red-300">
                  {error}
                </div>
              )}

            </div>

          </motion.div>
        )}

        {/* =====================================
            CAREER GALAXY
        ===================================== */}

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

              {careers.map(
                (career, index) => (
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
                    whileHover={{
                      y: -8,
                    }}
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
                        transition={{
                          duration: 1,
                        }}
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

                        {career.skills.map(
                          (skill) => (
                            <span
                              key={skill}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300"
                            >
                              {skill}
                            </span>
                          )
                        )}

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
                      className="mt-7 w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 py-4 font-black tracking-wider transition hover:scale-[1.02]"
                    >
                      EXPLORE CAREER →
                    </button>

                  </motion.div>
                )
              )}

            </div>

            <div className="mt-12 text-center">

              <button
                type="button"
                onClick={() => {
                  setStage("fields");
                  setSelectedFields([]);
                  setCustomField("");
                  setCurrentQuestion(0);
                  setCareers([]);
                  setAnswers({});
                  setCustomAnswers({});
                  setAnalysisProgress(0);
                }}
                className="rounded-full border border-white/10 bg-white/5 px-7 py-3 font-bold text-gray-300 hover:bg-white/10"
              >
                ↻ Start Again
              </button>

            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </section>
  );
}

