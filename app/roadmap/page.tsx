"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Navbar from "../explore/components/Navbar";
import { PROFILE_UPDATED_EVENT, type InnovateXProfile, getProfile } from "../../lib/profile";
import {
  type RoadmapState,
  type WeeklyTask,
  calculateProgress,
  completeTask,
  getCurrentWeek,
  getHistory,
  getLongTermGoal,
  getWeeklyTasks,
  loadRoadmap,
  selectCareer,
  suggestCareers,
} from "../../lib/roadmap";

function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`h-2 overflow-hidden rounded-full bg-slate-800 ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400"
      />
    </div>
  );
}

function Metric({ label, value, accent = "text-white" }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-[10px] font-bold tracking-[0.16em] text-slate-500">{label}</p>
      <motion.p key={value} initial={{ opacity: 0.45, y: 3 }} animate={{ opacity: 1, y: 0 }} className={`mt-2 text-xl font-black tracking-tight ${accent}`}>{value}</motion.p>
    </div>
  );
}

function getStageProgress(stage: RoadmapState["stages"][number]) {
  return stage.milestones.length ? Math.round((stage.milestones.filter((milestone) => milestone.completed).length / stage.milestones.length) * 100) : 0;
}

export default function RoadmapPage() {
  const reduceMotion = useReducedMotion();
  const [profile, setProfile] = useState<InnovateXProfile | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapState | null>(null);
  const [selectedTask, setSelectedTask] = useState<WeeklyTask | null>(null);
  const [celebration, setCelebration] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedProfile = getProfile();
    if (!storedProfile?.onboardingCompleted) {
      setLoading(false);
      return;
    }
    let nextRoadmap = loadRoadmap(storedProfile);
    nextRoadmap = getWeeklyTasks(nextRoadmap, storedProfile).state;
    setProfile(storedProfile);
    setRoadmap(nextRoadmap);
    setLoading(false);
  }, []);

  useEffect(() => {
    function syncProfile() {
      const storedProfile = getProfile();
      if (!storedProfile?.onboardingCompleted) return;
      setProfile(storedProfile);
      setRoadmap((current) => {
        if (!current || current.careerSelectedManually || current.progress.totalTasksCompleted > 0) return current;
        return getWeeklyTasks(loadRoadmap(storedProfile), storedProfile).state;
      });
    }

    window.addEventListener(PROFILE_UPDATED_EVENT, syncProfile);
    window.addEventListener("storage", syncProfile);
    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, syncProfile);
      window.removeEventListener("storage", syncProfile);
    };
  }, []);

  const weekKey = getCurrentWeek();
  const tasks = roadmap?.weeklyTasks[weekKey] ?? [];
  const metrics = useMemo(() => roadmap ? calculateProgress(roadmap, weekKey) : null, [roadmap, weekKey]);
  const longTermGoal = useMemo(() => roadmap && metrics ? getLongTermGoal(roadmap, metrics.overallProgress) : null, [roadmap, metrics]);
  const history = useMemo(() => roadmap ? getHistory(roadmap, weekKey) : [], [roadmap, weekKey]);
  const todayLabel = new Intl.DateTimeFormat("en-IN", { weekday: "long", month: "long", day: "numeric" }).format(new Date());

  function chooseCareer(career: RoadmapState["career"]) {
    if (!roadmap || !profile) return;
    const nextRoadmap = selectCareer(roadmap, profile, career);
    const withTasks = getWeeklyTasks(nextRoadmap, profile).state;
    setRoadmap(withTasks);
  }

  function finishTask(task: WeeklyTask) {
    if (!roadmap || roadmap.progress.completedTaskIds.includes(task.id)) return;
    const nextRoadmap = completeTask(roadmap, task.id);
    setRoadmap(nextRoadmap);
    setSelectedTask(null);
    setCelebration(`+${task.xpReward} XP added`);
    window.setTimeout(() => setCelebration(null), 2200);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07111f] text-white">
        <Navbar />
        <div className="mx-auto flex min-h-screen max-w-5xl items-center px-5 pt-24">
          <div className="w-full animate-pulse space-y-5"><div className="h-12 w-2/5 rounded-xl bg-slate-800" /><div className="h-52 rounded-3xl bg-slate-900" /><div className="grid gap-4 md:grid-cols-3"><div className="h-32 rounded-2xl bg-slate-900" /><div className="h-32 rounded-2xl bg-slate-900" /><div className="h-32 rounded-2xl bg-slate-900" /></div></div>
        </div>
      </main>
    );
  }

  if (!profile || !roadmap || !metrics || !longTermGoal) {
    return (
      <main className="min-h-screen bg-[#07111f] px-5 pt-28 text-white"><Navbar />
        <section className="mx-auto max-w-xl rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-center shadow-xl">
          <p className="text-xs font-bold tracking-[0.2em] text-blue-300">CAREER ROADMAP</p>
          <h1 className="mt-3 text-3xl font-black">Choose a career to build your roadmap.</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">Complete your InnovateX profile first so we can create a useful weekly plan around your interests and strengths.</p>
          <Link href="/onboarding" className="mt-6 inline-flex rounded-xl bg-blue-400 px-5 py-3 text-sm font-black text-slate-950">Complete Profile →</Link>
        </section>
      </main>
    );
  }

  const completedTaskIds = roadmap.progress.completedTaskIds;
  const suggestions = suggestCareers(profile);

  return (
    <main className="min-h-screen bg-[#07111f] pb-12 text-white">
      <Navbar />
      <div className="pointer-events-none fixed inset-0 -z-0 bg-[linear-gradient(115deg,rgba(15,23,42,0.98),rgba(7,17,31,0.94))]" />

      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-8 pt-28 md:px-6">
        <motion.header initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-blue-300">CAREER PROGRESS SYSTEM</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Your Mission Roadmap</h1>
            <p className="mt-2 text-sm text-slate-400">Turn your long-term ambition into consistent weekly action.</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/75 p-2.5 shadow-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-300 text-sm font-black text-slate-950">{profile.name.slice(0, 1).toUpperCase()}</div>
            <div className="pr-3"><p className="text-sm font-bold">Good evening, {profile.name.split(" ")[0]}</p><p className="text-xs text-slate-400">{profile.educationLevel}{profile.classOrYear ? ` • ${profile.classOrYear}` : ""}</p></div>
          </div>
        </motion.header>

        <motion.section initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mt-6 grid gap-4 xl:grid-cols-[1.55fr_0.95fr]">
          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/75 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] md:p-7">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div><p className="text-xs font-bold tracking-[0.18em] text-blue-300">YOUR CAREER ROADMAP</p><h2 className="mt-2 text-2xl font-black md:text-3xl">{longTermGoal.title}</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">{longTermGoal.description}</p></div>
              <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.06] px-4 py-3 text-right"><p className="text-[10px] font-bold tracking-[0.16em] text-cyan-200">SUCCESS</p><motion.p key={metrics.overallProgress} initial={{ opacity: 0.35, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-1 text-3xl font-black text-cyan-100">{metrics.overallProgress}%</motion.p></div>
            </div>
            <div className="mt-7"><div className="mb-2 flex justify-between text-xs font-semibold text-slate-400"><span>Career progress</span><span>{metrics.completedMilestones} / {metrics.totalMilestones} milestones</span></div><ProgressBar value={metrics.overallProgress} className="h-3" /></div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"><Metric label="TOTAL XP" value={`${roadmap.progress.totalXp.toLocaleString()} XP`} accent="text-cyan-200" /><Metric label="LEVEL" value={`Level ${metrics.level}`} accent="text-blue-200" /><Metric label="STREAK" value={`${roadmap.progress.currentStreak} days`} accent="text-amber-200" /><Metric label="TASKS DONE" value={roadmap.progress.totalTasksCompleted} accent="text-emerald-200" /></div>
          </div>

          <aside className="rounded-3xl border border-slate-800 bg-slate-900/75 p-5 shadow-lg md:p-6">
            <p className="text-xs font-bold tracking-[0.18em] text-violet-300">CAREER FOCUS</p>
            <h3 className="mt-2 text-xl font-black">{roadmap.career.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">Your roadmap adapts to the profile choices you have already made.</p>
            <div className="mt-4 flex flex-wrap gap-2">{roadmap.career.focusSkills.map((skill) => <span key={skill} className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-300">{skill}</span>)}</div>
            <div className="mt-5 border-t border-slate-800 pt-4"><p className="text-[10px] font-bold tracking-[0.16em] text-slate-500">SWITCH ROADMAP FOCUS</p><div className="mt-3 flex flex-wrap gap-2">{suggestions.map((career) => <button type="button" key={career.id} onClick={() => chooseCareer(career)} className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${career.id === roadmap.career.id ? "bg-blue-400 text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>{career.title}</button>)}</div></div>
          </aside>
        </motion.section>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-3"><div><p className="text-xs font-bold tracking-[0.18em] text-slate-500">CAREER JOURNEY</p><h2 className="mt-1 text-2xl font-black">Roadmap stages</h2></div><p className="text-xs text-slate-500">Progress is calculated from completed milestones (80%) and completed tasks (20%).</p></div>
          <div className="mt-4 grid gap-3 lg:grid-cols-4">{roadmap.stages.map((stage, index) => { const progress = getStageProgress(stage); return <motion.article key={stage.id} initial={reduceMotion ? false : { opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * index }} className={`relative rounded-2xl border p-5 ${stage.state === "locked" ? "border-slate-800 bg-slate-950/50 opacity-65" : stage.state === "completed" ? "border-emerald-400/25 bg-emerald-400/[0.05]" : "border-blue-400/30 bg-slate-900/80 shadow-[0_0_24px_rgba(59,130,246,0.08)]"}`}><div className="flex items-center justify-between"><span className="text-xs font-black text-slate-500">0{stage.order}</span><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${stage.state === "completed" ? "bg-emerald-400/15 text-emerald-200" : stage.state === "unlocked" ? "bg-blue-400/15 text-blue-200" : "bg-slate-800 text-slate-500"}`}>{stage.state.toUpperCase()}</span></div><h3 className="mt-4 font-black">{stage.title}</h3><p className="mt-2 min-h-12 text-xs leading-5 text-slate-400">{stage.description}</p><div className="mt-4"><div className="mb-2 flex justify-between text-xs text-slate-500"><span>Stage progress</span><span>{progress}%</span></div><ProgressBar value={progress} /></div><ul className="mt-4 space-y-2">{stage.milestones.map((milestone) => <li key={milestone.id} className={`flex gap-2 text-xs ${milestone.completed ? "text-emerald-200" : "text-slate-400"}`}><span>{milestone.completed ? "✓" : "○"}</span>{milestone.title}</li>)}</ul></motion.article> })}</div>
        </section>

        <section className="mt-8 grid gap-5 xl:grid-cols-[1.6fr_0.8fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/75 p-5 shadow-lg md:p-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-xs font-bold tracking-[0.18em] text-blue-300">THIS WEEK</p><h2 className="mt-1 text-2xl font-black">Weekly missions</h2><p className="mt-1 text-sm text-slate-400">Complete focused tasks to move your current roadmap stage forward.</p></div><div className="rounded-xl bg-slate-800 px-3 py-2 text-xs text-slate-300">Week of {new Intl.DateTimeFormat("en-IN", { month: "short", day: "numeric" }).format(new Date(`${weekKey}T12:00:00`))}</div></div>
            <div className="mt-6 grid gap-3">{tasks.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">Your current roadmap is complete. Choose a new career focus to begin another journey.</div> : tasks.map((task, index) => { const completed = completedTaskIds.includes(task.id); return <motion.button type="button" key={task.id} onClick={() => setSelectedTask(task)} whileHover={completed ? undefined : { y: -2 }} className={`grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border p-4 text-left transition ${completed ? "border-emerald-400/20 bg-emerald-400/[0.045]" : "border-slate-800 bg-slate-950/45 hover:border-blue-400/35 hover:bg-slate-800/80"}`}><span className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black ${completed ? "bg-emerald-400 text-slate-950" : "bg-slate-800 text-slate-400"}`}>{completed ? "✓" : `0${index + 1}`}</span><span><span className="block text-sm font-bold text-white">{task.title}</span><span className="mt-1 block text-xs text-slate-400">{task.category} • {task.estimatedTime} • {task.relatedSkill}</span></span><span className={`text-xs font-black ${completed ? "text-emerald-200" : "text-cyan-200"}`}>{completed ? "COMPLETED" : `+${task.xpReward} XP`}</span></motion.button> })}</div>
            {metrics.currentWeekTotal > 0 && metrics.currentWeekCompleted === metrics.currentWeekTotal && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.07] p-4 text-sm text-emerald-100">Weekly sprint complete. Your next set of missions arrives with the next weekly cycle.</motion.div>}
          </div>

          <aside className="space-y-5"><div className="rounded-3xl border border-slate-800 bg-slate-900/75 p-5 shadow-lg"><p className="text-xs font-bold tracking-[0.18em] text-cyan-300">WEEKLY PULSE</p><h3 className="mt-2 text-xl font-black">{todayLabel}</h3><div className="mt-5"><div className="mb-2 flex justify-between text-xs text-slate-400"><span>Missions</span><span>{metrics.currentWeekCompleted} / {metrics.currentWeekTotal}</span></div><ProgressBar value={metrics.currentWeekTotal ? (metrics.currentWeekCompleted / metrics.currentWeekTotal) * 100 : 0} /></div><div className="mt-5 grid grid-cols-2 gap-3"><Metric label="WEEK XP" value={`${metrics.currentWeekXp} XP`} accent="text-cyan-200" /><Metric label="NEXT LEVEL" value={`${metrics.xpForNextLevel - metrics.xpIntoLevel} XP`} accent="text-violet-200" /></div></div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/75 p-5 shadow-lg"><p className="text-xs font-bold tracking-[0.18em] text-slate-500">YOUR CAREER PROFILE</p><div className="mt-4 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-400 text-sm font-black text-slate-950">{profile.name.slice(0, 1).toUpperCase()}</div><div><p className="font-bold">{profile.name}</p><p className="text-xs text-slate-400">Aspiring {roadmap.career.title}</p></div></div><div className="mt-5 grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs text-slate-500">Projects</p><p className="mt-1 font-black">{roadmap.progress.projectsCompleted} completed</p></div><div><p className="text-xs text-slate-500">Achievements</p><p className="mt-1 font-black">{roadmap.progress.achievements.filter((item) => item.unlocked).length} unlocked</p></div></div><div className="mt-4 flex flex-wrap gap-2">{roadmap.career.focusSkills.slice(0, 4).map((skill) => <span key={skill} className="rounded-full bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-300">{skill}</span>)}</div></div></aside>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]"><div className="rounded-3xl border border-slate-800 bg-slate-900/75 p-5 md:p-6"><p className="text-xs font-bold tracking-[0.18em] text-slate-500">ACHIEVEMENTS</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{roadmap.progress.achievements.map((achievement) => <div key={achievement.id} className={`rounded-2xl border p-4 ${achievement.unlocked ? "border-amber-300/25 bg-amber-300/[0.06]" : "border-slate-800 bg-slate-950/40 opacity-55"}`}><span className="text-xl">{achievement.icon}</span><p className="mt-2 text-sm font-bold">{achievement.title}</p><p className="mt-1 text-xs leading-5 text-slate-400">{achievement.description}</p></div>)}</div></div><div className="rounded-3xl border border-slate-800 bg-slate-900/75 p-5 md:p-6"><p className="text-xs font-bold tracking-[0.18em] text-slate-500">VIEW PROGRESS HISTORY</p><div className="mt-4 space-y-3">{history.length ? history.map((item) => <div key={item.weekKey} className="flex items-center justify-between rounded-xl bg-slate-950/50 p-3 text-sm"><div><p className="font-semibold">Week of {item.weekKey}</p><p className="mt-1 text-xs text-slate-500">{item.completed}/{item.total} missions completed</p></div><span className="font-black text-cyan-200">{item.xp} XP</span></div>) : <p className="rounded-xl bg-slate-950/50 p-4 text-sm leading-6 text-slate-400">Your completed weekly missions will appear here as your journey grows.</p>}</div><div className="mt-5 border-t border-slate-800 pt-5"><p className="text-sm font-bold">Need help with your goals?</p><p className="mt-1 text-xs leading-5 text-slate-400">Guru Ji can help you choose a focused next step.</p><Link href="/ai-mentor" className="mt-3 inline-flex rounded-xl bg-blue-400 px-4 py-2.5 text-xs font-black text-slate-950">Talk to Guru Ji →</Link></div></div></section>
      </section>

      <AnimatePresence>{selectedTask && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[10000] flex items-end bg-slate-950/75 p-3 backdrop-blur-sm sm:items-center sm:justify-center" onClick={() => setSelectedTask(null)}><motion.article initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18 }} onClick={(event) => event.stopPropagation()} className="w-full max-w-xl rounded-3xl border border-slate-700 bg-[#0b1626] p-5 shadow-2xl md:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold tracking-[0.18em] text-blue-300">{selectedTask.category.toUpperCase()} MISSION</p><h2 className="mt-2 text-2xl font-black">{selectedTask.title}</h2></div><button type="button" onClick={() => setSelectedTask(null)} className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-slate-300">×</button></div><p className="mt-4 text-sm leading-6 text-slate-300">{selectedTask.description}</p><div className="mt-5 grid grid-cols-2 gap-3"><Metric label="SKILL GAINED" value={selectedTask.relatedSkill} accent="text-cyan-200" /><Metric label="REWARD" value={`+${selectedTask.xpReward} XP`} accent="text-emerald-200" /><Metric label="TIME" value={selectedTask.estimatedTime} /><Metric label="DIFFICULTY" value={selectedTask.difficulty} accent="text-violet-200" /></div><div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/50 p-4"><p className="text-xs font-bold tracking-[0.16em] text-slate-500">WHY THIS MATTERS</p><p className="mt-2 text-sm leading-6 text-slate-300">{selectedTask.whyItMatters}</p></div><div className="mt-5"><p className="text-xs font-bold tracking-[0.16em] text-slate-500">HOW TO COMPLETE IT</p><ol className="mt-3 space-y-2">{selectedTask.instructions.map((instruction, index) => <li key={instruction} className="flex gap-3 text-sm text-slate-300"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-cyan-200">{index + 1}</span>{instruction}</li>)}</ol></div><button type="button" disabled={completedTaskIds.includes(selectedTask.id)} onClick={() => finishTask(selectedTask)} className={`mt-7 w-full rounded-xl px-5 py-3.5 text-sm font-black transition ${completedTaskIds.includes(selectedTask.id) ? "cursor-default bg-emerald-400/15 text-emerald-200" : "bg-blue-400 text-slate-950 hover:bg-cyan-300"}`}>{completedTaskIds.includes(selectedTask.id) ? "✓ Completed" : `Complete Task • +${selectedTask.xpReward} XP`}</button></motion.article></motion.div>}</AnimatePresence>
      <AnimatePresence>{celebration && <motion.div initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }} className="fixed bottom-6 left-1/2 z-[10001] -translate-x-1/2 rounded-full border border-emerald-300/25 bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-[0_0_35px_rgba(52,211,153,0.35)]">✓ {celebration}</motion.div>}</AnimatePresence>
    </main>
  );
}
