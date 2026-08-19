"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../explore/components/Navbar";

type Message = {
  role: "user" | "guru";
  text: string;
};

const suggestions = [
  "Which career suits my interests?",
  "How do I become an AI Engineer?",
  "What skills should I learn?",
  "Help me choose a career",
];

function renderGuruMessage(text: string) {
  const blocks = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block, blockIndex) => {
    const lines = block
      .split(/\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const isBulletList = lines.length > 0 && lines.every((line) => /^[-*•]\s+/.test(line));
    const isNumberedList = lines.length > 0 && lines.every((line) => /^\d+\.\s+/.test(line));

    if (isBulletList) {
      return (
        <ul key={`block-${blockIndex}`} className="list-disc space-y-1 pl-5 text-gray-200">
          {lines.map((line, lineIndex) => (
            <li key={`${blockIndex}-${lineIndex}`}>{line.replace(/^[-*•]\s+/, "")}</li>
          ))}
        </ul>
      );
    }

    if (isNumberedList) {
      return (
        <ol key={`block-${blockIndex}`} className="list-decimal space-y-1 pl-5 text-gray-200">
          {lines.map((line, lineIndex) => (
            <li key={`${blockIndex}-${lineIndex}`}>{line.replace(/^\d+\.\s+/, "")}</li>
          ))}
        </ol>
      );
    }

    return (
      <div key={`block-${blockIndex}`} className="space-y-3">
        {block.split(/\n+/).map((paragraph, paragraphIndex) => (
          <p key={`${blockIndex}-${paragraphIndex}`} className="leading-7 text-gray-200">
            {paragraph}
          </p>
        ))}
      </div>
    );
  });
}

export default function AIMentorPage() {
  const [messages, setMessages] = useState<Message[]>([]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  async function sendMessage(message?: string) {
    const text = (message ?? input).trim();

    if (!text || loading) return;

    setInput("");

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text,
      },
    ]);

    setLoading(true);

    try {
      const response = await fetch("/api/mentor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      if (!response.ok) {
        const textBody = await response.text();
        console.error("Mentor API error", textBody);
        throw new Error("GURU JI is having trouble connecting right now. Please try again in a moment.");
      }

      const contentType = response.headers.get("content-type") || "";
      let data: { response?: string; error?: string } | null = null;

      if (contentType.includes("application/json")) {
        data = await response.json().catch(() => null);
      } else {
        await response.text();
      }

      const guruReply = data?.response?.trim();

      if (!guruReply) {
        throw new Error("GURU JI is having trouble connecting right now. Please try again in a moment.");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "guru",
          text: guruReply,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "guru",
          text: "GURU JI is having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    sendMessage();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !loading) {
        sendMessage();
      }
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] text-white selection:bg-cyan-300 selection:text-slate-950">
      <Navbar />

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,0.15),transparent_27%),radial-gradient(circle_at_85%_8%,rgba(168,85,247,0.14),transparent_22%),radial-gradient(circle_at_10%_85%,rgba(59,130,246,0.13),transparent_25%)]" />
        <div className="absolute left-1/2 top-[42%] h-[550px] w-[550px] -translate-x-1/2 rounded-full border border-cyan-300/10" />
        <div className="absolute left-1/2 top-[42%] h-[720px] w-[720px] -translate-x-1/2 rounded-full border border-violet-400/5" />
        <motion.div
          animate={{ scale: [1, 1.14, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/3 h-[440px] w-[440px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[130px]"
        />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-6 pt-24 md:px-6 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-5 text-center md:mb-7"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-[10px] font-bold tracking-[0.25em] text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.12)]">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,1)]" />
            INNOVATEX • AI CAREER MENTOR
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-violet-400 bg-clip-text text-transparent">
              GURU JI 🧘‍♂️
            </span>
          </h1>

          <p className="mx-auto mt-2 max-w-2xl text-sm font-medium text-slate-300 md:text-base">
            Your AI Career Mentor
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="mx-auto flex min-h-[620px] w-full max-w-5xl flex-1 flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/55 shadow-[0_0_80px_rgba(34,211,238,0.1),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.025] px-5 py-4 md:px-7">
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-200/30 bg-gradient-to-br from-cyan-400/30 via-sky-500/30 to-violet-600/40 text-2xl shadow-[0_0_24px_rgba(34,211,238,0.24)]">
                <span className="absolute inset-1 rounded-xl border border-white/10" />
                <span className="relative">🧘‍♂️</span>
              </div>

              <div>
                <h2 className="font-bold tracking-wide text-white">GURU JI</h2>

                <div className="mt-0.5 flex items-center gap-2 text-[11px] font-medium tracking-wide text-cyan-100/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,1)]" />
                  ONLINE • READY TO GUIDE
                </div>
              </div>
            </div>

            <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] text-slate-400 sm:block">
              FUTURE MODE
            </div>
          </div>

          <div className="relative flex-1 overflow-y-auto px-4 py-5 md:px-7 md:py-7">
            {messages.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="mx-auto flex min-h-[360px] max-w-2xl flex-col items-center justify-center text-center"
              >
                <motion.div
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                  className="mb-5 flex h-20 w-20 items-center justify-center rounded-[1.6rem] border border-cyan-200/30 bg-gradient-to-br from-cyan-400/20 via-sky-500/15 to-violet-500/25 text-4xl shadow-[0_0_45px_rgba(34,211,238,0.2)]"
                >
                  🧘‍♂️
                </motion.div>
                <p className="text-2xl font-bold tracking-tight text-white md:text-3xl">Namaste! I&apos;m Guru Ji.</p>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
                  Ask me anything about your future, careers, skills or learning journey.
                </p>
                <div className="mt-7 grid w-full grid-cols-1 gap-2 text-left sm:grid-cols-2">
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={suggestion}
                      type="button"
                      aria-label={`Ask GURU JI: ${suggestion}`}
                      onClick={() => sendMessage(suggestion)}
                      disabled={loading}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.06 }}
                      whileHover={{ y: -2, scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="group flex min-h-14 items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-left text-sm text-slate-300 transition hover:border-cyan-300/35 hover:bg-cyan-300/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span>{suggestion}</span>
                      <span className="ml-3 text-cyan-300/70 transition group-hover:translate-x-0.5 group-hover:text-cyan-200">↗</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="space-y-5">
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                <motion.div
                  key={`${message.role}-${index}`}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3.5 text-sm leading-7 shadow-lg md:max-w-[74%] md:px-5 ${
                      message.role === "user"
                        ? "rounded-br-md border border-cyan-200/20 bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-cyan-950/40"
                        : "rounded-bl-md border border-white/10 bg-white/[0.055] text-slate-200 shadow-black/20"
                    }`}
                  >
                    {message.role === "guru" && (
                      <div className="mb-2 flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] text-cyan-300">
                        <span>🧘‍♂️</span> GURU JI
                      </div>
                    )}

                    {message.role === "guru" ? (
                      <div className="space-y-3">{renderGuruMessage(message.text)}</div>
                    ) : (
                      <div className="whitespace-pre-wrap text-white">{message.text}</div>
                    )}
                  </div>
                </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="rounded-2xl rounded-bl-md border border-cyan-300/15 bg-cyan-300/[0.055] px-4 py-3.5 shadow-lg shadow-cyan-950/20">
                  <div className="mb-2 flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] text-cyan-300">
                    <span>🧘‍♂️</span> GURU JI
                  </div>

                  <div className="flex items-center gap-2.5 text-sm text-slate-300">
                    <div className="flex gap-1">
                    <motion.span
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="h-1.5 w-1.5 rounded-full bg-cyan-300"
                    />
                    <motion.span
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                      className="h-1.5 w-1.5 rounded-full bg-cyan-300"
                    />
                    <motion.span
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                      className="h-1.5 w-1.5 rounded-full bg-cyan-300"
                    />
                    </div>
                    Guru Ji is thinking...
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-white/10 bg-black/10 p-3 md:p-4">
            <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-slate-950/70 p-2 transition focus-within:border-cyan-300/45 focus-within:shadow-[0_0_30px_rgba(34,211,238,0.08)]">
              <textarea
                aria-label="Type your question to GURU JI"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={loading}
                placeholder="Ask GURU JI anything about your future..."
                className="min-h-[52px] max-h-[180px] min-w-0 flex-1 resize-none bg-transparent px-3 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500"
              />

              <motion.button
                type="submit"
                aria-label="Send message to GURU JI"
                disabled={loading || !input.trim()}
                whileHover={!loading && input.trim() ? { scale: 1.03 } : undefined}
                whileTap={!loading && input.trim() ? { scale: 0.97 } : undefined}
                className="flex min-h-[52px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 text-sm font-bold text-slate-950 shadow-[0_0_22px_rgba(34,211,238,0.25)] transition disabled:cursor-not-allowed disabled:opacity-35 sm:px-5"
              >
                {loading ? "Thinking" : "Send"} <span className="ml-1.5 text-base">✦</span>
              </motion.button>
            </div>
            <p className="px-2 pt-2 text-[10px] text-slate-500">Press Enter to send • Shift + Enter for a new line</p>
          </form>
        </motion.div>

        <p className="mt-4 text-center text-xs text-slate-500">
          GURU JI provides guidance and ideas — your choices shape your future.
        </p>
      </section>
    </main>
  );
}
