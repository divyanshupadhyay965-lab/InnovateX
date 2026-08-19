"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "../explore/components/Navbar";
import {
  type EducationLevel,
  type InnovateXProfile,
  getDemoUser,
  getProfile,
  saveProfile,
} from "../../lib/profile";

type ProfileDraft = Omit<InnovateXProfile, "name" | "email" | "onboardingCompleted" | "educationLevel"> & {
  educationLevel: EducationLevel | "";
};

type Step = "education" | "class" | "subjects" | "field" | "year" | "goals" | "interests" | "skills" | "research" | "activity";

const educationOptions: { value: EducationLevel; icon: string }[] = [
  { value: "School Student", icon: "🏫" },
  { value: "College Student", icon: "🎓" },
  { value: "Graduate / Working", icon: "💼" },
  { value: "Researcher", icon: "🔬" },
  { value: "Other", icon: "🌌" },
];

const classes = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];
const subjects = ["Mathematics", "Science", "Computer Science", "English", "Social Science", "Commerce", "Arts", "Other"];
const interests = ["🤖 Artificial Intelligence", "💻 Technology", "🚀 Space", "🧪 Science & Research", "🔧 Engineering", "💼 Business & Entrepreneurship", "🎨 Design & Creativity", "🏥 Healthcare", "🌍 Environment", "📊 Finance", "🛡️ Cybersecurity"];
const skills = ["Problem Solving", "Mathematics", "Coding", "Communication", "Creativity", "Leadership", "Research", "Building Things", "Teamwork", "Analysis"];
const collegeFields = ["Engineering", "Medicine", "Science", "Commerce", "Humanities", "Law", "Design", "Computer Science", "Business", "Other"];
const workingFields = ["Technology", "Engineering", "Business", "Finance", "Healthcare", "Science", "Design", "Government", "Education", "Other"];
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate"];
const workingGoals = ["Build a career", "Switch careers", "Start a business", "Learn new skills", "Research", "Higher education", "Other"];
const researchFields = ["Artificial Intelligence", "Computer Science", "Engineering", "Medicine & Healthcare", "Physics & Space", "Environment", "Social Sciences", "Business & Economics", "Other"];
const researchGoals = ["Research opportunities", "Projects", "Higher studies", "Career opportunities", "Collaboration", "Industry opportunities", "Other"];

const emptyDraft: ProfileDraft = {
  educationLevel: "",
  classOrYear: "",
  field: "",
  interests: [],
  subjects: [],
  skills: [],
  goals: [],
};

function stepsFor(level: ProfileDraft["educationLevel"]): Step[] {
  switch (level) {
    case "School Student":
      return ["education", "class", "subjects", "interests", "skills"];
    case "College Student":
      return ["education", "field", "year", "interests", "skills"];
    case "Graduate / Working":
      return ["education", "field", "goals", "interests", "skills"];
    case "Researcher":
      return ["education", "research", "goals"];
    case "Other":
      return ["education", "activity", "interests", "skills"];
    default:
      return ["education"];
  }
}

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export default function OnboardingPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<ProfileDraft>(emptyDraft);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [customField, setCustomField] = useState("");
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const existingProfile = getProfile();
    const demoUser = getDemoUser();

    if (existingProfile) {
      setDraft({
        educationLevel: existingProfile.educationLevel,
        classOrYear: existingProfile.classOrYear,
        field: existingProfile.field,
        interests: existingProfile.interests,
        subjects: existingProfile.subjects,
        skills: existingProfile.skills,
        goals: existingProfile.goals,
      });
      setName(existingProfile.name);
      setEmail(existingProfile.email);
      return;
    }

    if (!demoUser) {
      router.replace("/sign-in");
      return;
    }

    setName(demoUser.name);
    setEmail(demoUser.email);
  }, [router]);

  const steps = useMemo(() => stepsFor(draft.educationLevel), [draft.educationLevel]);
  const currentStep = steps[stepIndex] ?? "education";
  const questionNumber = stepIndex + 1;
  const isLastStep = stepIndex === steps.length - 1;

  function setEducationLevel(level: EducationLevel) {
    setDraft({ ...emptyDraft, educationLevel: level });
    setCustomField("");
    setStepIndex(0);
  }

  function setSingleValue(key: "classOrYear" | "field", value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
    if (value !== "Other") setCustomField("");
  }

  function setMultiValue(key: "subjects" | "interests" | "skills" | "goals", value: string) {
    setDraft((current) => ({ ...current, [key]: toggleValue(current[key], value) }));
  }

  function isCurrentStepComplete() {
    switch (currentStep) {
      case "education":
        return Boolean(draft.educationLevel);
      case "class":
      case "year":
        return Boolean(draft.classOrYear);
      case "field":
      case "research":
      case "activity":
        return Boolean(draft.field && (draft.field !== "Other" || customField.trim()));
      case "subjects":
        return draft.subjects.length > 0;
      case "interests":
        return draft.interests.length > 0;
      case "skills":
        return draft.skills.length > 0;
      case "goals":
        return draft.goals.length > 0;
    }
  }

  function continueOnboarding() {
    if (!isCurrentStepComplete()) return;

    if (!isLastStep) {
      setStepIndex((current) => current + 1);
      return;
    }

    if (!draft.educationLevel) return;

    const profile: InnovateXProfile = {
      name,
      email,
      ...draft,
      educationLevel: draft.educationLevel,
      field: draft.field === "Other" ? customField.trim() : draft.field,
      onboardingCompleted: true,
    };

    saveProfile(profile);
    setComplete(true);
  }

  function goBack() {
    if (stepIndex === 0) {
      router.push("/sign-in");
      return;
    }

    setStepIndex((current) => current - 1);
  }

  function optionButton(label: string, selected: boolean, onClick: () => void, icon?: string) {
    return (
      <motion.button
        key={label}
        type="button"
        onClick={onClick}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`group flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
          selected
            ? "border-cyan-300/60 bg-cyan-300/[0.14] text-white shadow-[0_0_24px_rgba(34,211,238,0.16)]"
            : "border-white/10 bg-white/[0.035] text-slate-300 hover:border-violet-300/35 hover:bg-violet-300/[0.07] hover:text-white"
        }`}
      >
        {icon && <span className="text-xl">{icon}</span>}
        <span className="flex-1">{label}</span>
        <span className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${selected ? "border-cyan-200 bg-cyan-300 text-slate-950" : "border-white/20 text-transparent"}`}>✓</span>
      </motion.button>
    );
  }

  function renderQuestion() {
    if (currentStep === "education") {
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {educationOptions.map((option) => optionButton(option.value, draft.educationLevel === option.value, () => setEducationLevel(option.value), option.icon))}
        </div>
      );
    }

    if (currentStep === "class") {
      return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{classes.map((option) => optionButton(option, draft.classOrYear === option, () => setSingleValue("classOrYear", option)))}</div>;
    }

    if (currentStep === "year") {
      return <div className="grid gap-3 sm:grid-cols-2">{years.map((option) => optionButton(option, draft.classOrYear === option, () => setSingleValue("classOrYear", option)))}</div>;
    }

    if (currentStep === "subjects") {
      return <div className="grid gap-3 sm:grid-cols-2">{subjects.map((option) => optionButton(option, draft.subjects.includes(option), () => setMultiValue("subjects", option)))}</div>;
    }

    if (currentStep === "interests") {
      return <div className="grid gap-3 sm:grid-cols-2">{interests.map((option) => optionButton(option, draft.interests.includes(option), () => setMultiValue("interests", option)))}</div>;
    }

    if (currentStep === "skills") {
      return <div className="grid gap-3 sm:grid-cols-2">{skills.map((option) => optionButton(option, draft.skills.includes(option), () => setMultiValue("skills", option)))}</div>;
    }

    const options = currentStep === "field"
      ? draft.educationLevel === "College Student" ? collegeFields : workingFields
      : currentStep === "research" ? researchFields : currentStep === "goals" ? draft.educationLevel === "Researcher" ? researchGoals : workingGoals : [];

    if (currentStep === "activity") {
      return (
        <input
          value={draft.field}
          onChange={(event) => setSingleValue("field", event.target.value)}
          placeholder="For example: preparing for an exam, freelancing, exploring careers..."
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:bg-cyan-300/[0.04]"
        />
      );
    }

    if (currentStep === "goals") {
      return <div className="grid gap-3 sm:grid-cols-2">{options.map((option) => optionButton(option, draft.goals.includes(option), () => setDraft((current) => ({ ...current, goals: [option] }))))}</div>;
    }

    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">{options.map((option) => optionButton(option, draft.field === option, () => setSingleValue("field", option)))}</div>
        {draft.field === "Other" && (
          <input
            value={customField}
            onChange={(event) => setCustomField(event.target.value)}
            placeholder="Tell us a little more"
            className="w-full rounded-2xl border border-cyan-300/25 bg-cyan-300/[0.05] px-5 py-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/60"
          />
        )}
      </div>
    );
  }

  const copy: Record<Step, { eyebrow: string; title: string; hint: string }> = {
    education: { eyebrow: "YOUR STARTING POINT", title: "What best describes you?", hint: "Choose the path that fits you today." },
    class: { eyebrow: "SCHOOL JOURNEY", title: "Which class are you in?", hint: "This helps us keep guidance age-appropriate." },
    subjects: { eyebrow: "YOUR FAVOURITES", title: "What subjects do you enjoy?", hint: "Choose all that spark your curiosity." },
    field: { eyebrow: "YOUR DIRECTION", title: draft.educationLevel === "College Student" ? "What are you studying?" : "What is your current field?", hint: "Choose the closest match for now." },
    year: { eyebrow: "COLLEGE JOURNEY", title: "Which year are you in?", hint: "Your learning stage shapes the right next steps." },
    goals: { eyebrow: "NEXT HORIZON", title: draft.educationLevel === "Researcher" ? "What are you looking for?" : "What are you looking to do next?", hint: "Choose the goal that matters most right now." },
    interests: { eyebrow: "CURIOSITY MAP", title: "What are you interested in?", hint: "Choose every universe you want to explore." },
    skills: { eyebrow: "STRENGTH SCAN", title: "What are you good at?", hint: "Choose strengths you already have or love using." },
    research: { eyebrow: "RESEARCH VECTOR", title: "What is your research field?", hint: "Choose the area closest to your work." },
    activity: { eyebrow: "YOUR STORY", title: "What are you currently doing?", hint: "A short description is enough to tailor your starting point." },
  };

  if (complete) {
    const finalField = draft.field === "Other" ? customField : draft.field;
    return (
      <main className="min-h-screen overflow-hidden bg-[#020617] px-4 pb-10 pt-28 text-white md:px-6">
        <Navbar />
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_80%_15%,rgba(168,85,247,0.14),transparent_24%)]" />
        <motion.section initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative mx-auto max-w-2xl rounded-[2rem] border border-cyan-300/20 bg-slate-950/65 p-6 text-center shadow-[0_0_80px_rgba(34,211,238,0.15)] backdrop-blur-2xl sm:p-9">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.7rem] border border-cyan-200/30 bg-cyan-300/10 text-4xl shadow-[0_0_35px_rgba(34,211,238,0.2)]">🌌</div>
          <p className="mt-6 text-xs font-bold tracking-[0.25em] text-cyan-300">CALIBRATION COMPLETE</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Your InnovateX profile is ready 🌌</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-300">Your universe is set up for a more relevant career, skills, and discovery journey.</p>
          <div className="mt-7 grid gap-3 text-left sm:grid-cols-2">
            {["Path", draft.educationLevel, "Stage", draft.classOrYear || finalField, "Interests", `${draft.interests.length} selected`, "Strengths", `${draft.skills.length} selected`].map((item, index) => index % 2 === 0 ? <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="text-[10px] font-bold tracking-[0.16em] text-slate-500">{item}</p><p className="mt-1 text-sm font-semibold text-white">{["Path", draft.educationLevel, "Stage", draft.classOrYear || finalField, "Interests", `${draft.interests.length} selected`, "Strengths", `${draft.skills.length} selected`][index + 1]}</p></div> : null)}
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => router.push("/profile")} className="mt-7 w-full rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 px-5 py-3.5 text-sm font-black text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.24)]">Enter My Universe →</motion.button>
        </motion.section>
      </main>
    );
  }

  const currentCopy = copy[currentStep];

  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] px-4 pb-10 pt-28 text-white md:px-6">
      <Navbar />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.14),transparent_25%),radial-gradient(circle_at_85%_16%,rgba(168,85,247,0.16),transparent_25%),radial-gradient(circle_at_50%_100%,rgba(37,99,235,0.15),transparent_32%)]" />

      <section className="relative mx-auto w-full max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-5 text-center">
          <p className="text-xs font-bold tracking-[0.25em] text-cyan-300">INNOVATEX IDENTITY</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Let&apos;s calibrate your journey 🚀</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300">Tell InnovateX a little about yourself so we can personalize your experience.</p>
        </motion.div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-5 shadow-[0_0_75px_rgba(34,211,238,0.11)] backdrop-blur-2xl sm:p-8">
          <div className="mb-7 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {steps.map((item, index) => <span key={item} className={`h-2.5 w-2.5 rounded-full transition ${index <= stepIndex ? "bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]" : "bg-white/15"}`} />)}
            </div>
            <p className="text-xs font-semibold text-slate-400">Question {questionNumber} of {steps.length}</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={`${draft.educationLevel}-${currentStep}`} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.25 }}>
              <p className="text-[10px] font-bold tracking-[0.2em] text-violet-300">{currentCopy.eyebrow}</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{currentCopy.title}</h2>
              <p className="mt-2 text-sm text-slate-400">{currentCopy.hint}</p>
              <div className="mt-6">{renderQuestion()}</div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
            <button type="button" onClick={goBack} className="rounded-xl px-3 py-2.5 text-sm font-bold text-slate-400 transition hover:bg-white/5 hover:text-white">← Back</button>
            <motion.button type="button" onClick={continueOnboarding} disabled={!isCurrentStepComplete()} whileHover={isCurrentStepComplete() ? { scale: 1.02 } : undefined} whileTap={isCurrentStepComplete() ? { scale: 0.98 } : undefined} className="rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 px-5 py-2.5 text-sm font-black text-slate-950 shadow-[0_0_22px_rgba(34,211,238,0.2)] disabled:cursor-not-allowed disabled:opacity-35">{isLastStep ? "Finish calibration ✦" : "Continue →"}</motion.button>
          </div>
        </div>
      </section>
    </main>
  );
}
