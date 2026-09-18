import type { InnovateXProfile } from "./profile";

export type TaskDifficulty = "Easy" | "Medium" | "Hard" | "Project";

export interface RoadmapCareer {
  id: string;
  title: string;
  description: string;
  focusSkills: string[];
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface RoadmapStage {
  id: string;
  order: number;
  title: string;
  description: string;
  skills: string[];
  milestones: Milestone[];
  state: "locked" | "unlocked" | "completed";
}

export interface LongTermGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  milestones: Milestone[];
}

export interface WeeklyTask {
  id: string;
  title: string;
  description: string;
  whyItMatters: string;
  instructions: string[];
  category: "Learn" | "Practice" | "Challenge" | "Project";
  estimatedTime: string;
  xpReward: number;
  difficulty: TaskDifficulty;
  dueDate: string;
  weekKey: string;
  relatedSkill: string;
  stageId: string;
  milestoneId: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface UserProgress {
  totalXp: number;
  completedTaskIds: string[];
  totalTasksCompleted: number;
  projectsCompleted: number;
  currentStreak: number;
  lastCompletionDate: string | null;
  achievements: Achievement[];
}

export interface RoadmapState {
  career: RoadmapCareer;
  careerSelectedManually: boolean;
  stages: RoadmapStage[];
  progress: UserProgress;
  weeklyTasks: Record<string, WeeklyTask[]>;
  createdAt: string;
}

export interface RoadmapMetrics {
  overallProgress: number;
  completedMilestones: number;
  totalMilestones: number;
  currentWeekXp: number;
  currentWeekCompleted: number;
  currentWeekTotal: number;
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
}

const ROADMAP_STORAGE_KEY = "innovatex_roadmap";
const ROADMAP_PROGRESS_KEY = "innovatex_progress";
const WEEKLY_TASKS_STORAGE_KEY = "innovatex_weekly_tasks";

const careerLibrary: RoadmapCareer[] = [
  { id: "ai-engineer", title: "AI Engineer", description: "Build mathematical, programming, and AI skills to create intelligent systems.", focusSkills: ["Mathematics", "Python", "Machine Learning", "Problem Solving"] },
  { id: "entrepreneur", title: "Entrepreneur", description: "Learn to identify problems, validate ideas, and build products people value.", focusSkills: ["Communication", "Market Research", "Business", "Leadership"] },
  { id: "aerospace-engineer", title: "Aerospace Engineer", description: "Develop the science, engineering, and systems thinking behind flight and space technology.", focusSkills: ["Physics", "Mathematics", "Engineering", "Design"] },
  { id: "doctor", title: "Doctor", description: "Build a strong science foundation and develop the empathy and discipline needed for healthcare.", focusSkills: ["Biology", "Chemistry", "Research", "Communication"] },
  { id: "researcher", title: "Researcher", description: "Turn curiosity into rigorous questions, evidence, and meaningful discoveries.", focusSkills: ["Research", "Analysis", "Writing", "Problem Solving"] },
  { id: "technology-builder", title: "Technology Builder", description: "Use technical skills and curiosity to build useful digital products and solutions.", focusSkills: ["Coding", "Design", "Problem Solving", "Projects"] },
];

const achievementTemplates: Omit<Achievement, "unlocked">[] = [
  { id: "first-step", title: "First Step", description: "Complete your first roadmap task.", icon: "✦" },
  { id: "week-warrior", title: "Week Warrior", description: "Complete every task in one weekly sprint.", icon: "⚡" },
  { id: "builder", title: "Builder", description: "Complete your first project task.", icon: "▣" },
  { id: "skill-unlocked", title: "Skill Unlocked", description: "Complete a roadmap milestone.", icon: "◈" },
  { id: "stage-complete", title: "Milestone", description: "Complete a full roadmap stage.", icon: "★" },
];

function storageAvailable() {
  return typeof window !== "undefined";
}

function readStorage<T>(key: string): T | null {
  if (!storageAvailable()) return null;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : null;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: unknown) {
  if (storageAvailable()) window.localStorage.setItem(key, JSON.stringify(value));
}

function normalize(values: string[]) {
  return values.join(" ").toLowerCase();
}

export function suggestCareers(profile: InnovateXProfile): RoadmapCareer[] {
  const profileText = normalize([profile.field, ...profile.interests, ...profile.subjects, ...profile.skills, ...profile.goals]);
  const priorityIds = profileText.includes("space") || profileText.includes("aerospace")
    ? ["aerospace-engineer", "ai-engineer", "researcher"]
    : profileText.includes("health") || profileText.includes("biology") || profileText.includes("medicine")
      ? ["doctor", "researcher", "technology-builder"]
      : profileText.includes("business") || profileText.includes("entrepreneur") || profileText.includes("finance")
        ? ["entrepreneur", "technology-builder", "researcher"]
        : profileText.includes("research") || profile.educationLevel === "Researcher"
          ? ["researcher", "ai-engineer", "technology-builder"]
          : profileText.includes("ai") || profileText.includes("computer") || profileText.includes("coding") || profileText.includes("technology")
            ? ["ai-engineer", "technology-builder", "researcher"]
            : ["technology-builder", "entrepreneur", "researcher"];

  return priorityIds.map((id) => careerLibrary.find((career) => career.id === id)).filter((career): career is RoadmapCareer => Boolean(career));
}

export function getCurrentWeek(date = new Date()) {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const weekday = (local.getDay() + 6) % 7;
  local.setDate(local.getDate() - weekday);
  return toDateKey(local);
}

export function toDateKey(date: Date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

function addDays(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

function stageTemplates(career: RoadmapCareer, profile: InnovateXProfile): RoadmapStage[] {
  const firstSkill = profile.skills[0] || career.focusSkills[0];
  const subject = profile.subjects[0] || career.focusSkills[1] || "core concepts";
  const project = career.id === "entrepreneur" ? "Build a first venture concept" : `Build a ${career.title} mini project`;
  const stages = [
    { title: "Foundation", description: `Create your base in ${subject}, ${firstSkill}, and the essentials behind ${career.title}.`, skills: career.focusSkills.slice(0, 2), milestones: [`Understand ${subject} fundamentals`, `Practice ${firstSkill}`, "Solve your first focused challenge", "Complete a foundation mini-task"] },
    { title: "Skill Building", description: `Develop practical ${career.focusSkills.slice(0, 3).join(", ")} through deliberate practice.`, skills: career.focusSkills.slice(0, 3), milestones: [`Learn an intermediate ${career.focusSkills[0]} concept`, `Apply ${career.focusSkills[1]} in practice`, "Review and improve your approach", "Share a learning reflection"] },
    { title: "Real-World Projects", description: "Turn your skills into visible work that shows how you think and build.", skills: [career.focusSkills[0], "Projects", "Communication"], milestones: ["Plan a useful project", `Build: ${project}`, "Test with feedback", "Publish your project story"] },
    { title: "Career Preparation", description: `Prepare evidence of your growth and make your next ${career.title} opportunity count.`, skills: ["Portfolio", "Communication", "Career Research"], milestones: ["Document your strongest work", "Research next opportunities", "Practice explaining your work", "Create your next-step plan"] },
  ];

  return stages.map((stage, index) => ({
    id: `stage-${index + 1}`,
    order: index + 1,
    title: stage.title,
    description: stage.description,
    skills: stage.skills,
    milestones: stage.milestones.map((title, milestoneIndex) => ({ id: `stage-${index + 1}-milestone-${milestoneIndex + 1}`, title, completed: false })),
    state: index === 0 ? "unlocked" : "locked",
  }));
}

function createProgress(): UserProgress {
  return {
    totalXp: 0,
    completedTaskIds: [],
    totalTasksCompleted: 0,
    projectsCompleted: 0,
    currentStreak: 0,
    lastCompletionDate: null,
    achievements: achievementTemplates.map((achievement) => ({ ...achievement, unlocked: false })),
  };
}

export function createRoadmap(profile: InnovateXProfile, career = suggestCareers(profile)[0]): RoadmapState {
  return {
    career,
    careerSelectedManually: false,
    stages: stageTemplates(career, profile),
    progress: createProgress(),
    weeklyTasks: {},
    createdAt: new Date().toISOString(),
  };
}

export function loadRoadmap(profile: InnovateXProfile) {
  const state = readStorage<RoadmapState>(ROADMAP_STORAGE_KEY);
  if (!state) return createRoadmap(profile);

  // Before a user earns progress, profile edits can safely refine the derived career.
  // Once work has been completed (or a career was picked manually), progress wins.
  const derivedCareer = suggestCareers(profile)[0];
  if (!state.careerSelectedManually && state.progress.totalTasksCompleted === 0 && derivedCareer.id !== state.career.id) {
    return createRoadmap(profile, derivedCareer);
  }

  return state;
}

export function saveRoadmap(state: RoadmapState) {
  writeStorage(ROADMAP_STORAGE_KEY, state);
  writeStorage(ROADMAP_PROGRESS_KEY, state.progress);
  writeStorage(WEEKLY_TASKS_STORAGE_KEY, state.weeklyTasks);
}

export function selectCareer(state: RoadmapState, profile: InnovateXProfile, career: RoadmapCareer): RoadmapState {
  const nextState: RoadmapState = {
    ...state,
    career,
    careerSelectedManually: true,
    stages: stageTemplates(career, profile),
    progress: createProgress(),
    weeklyTasks: {},
  };
  saveRoadmap(nextState);
  return nextState;
}

function activeStage(stages: RoadmapStage[]) {
  return stages.find((stage) => stage.state === "unlocked") ?? stages[stages.length - 1];
}

function taskBlueprint(career: RoadmapCareer, stage: RoadmapStage, profile: InnovateXProfile) {
  const subject = profile.subjects[0] || stage.skills[0];
  const personalSkill = profile.skills[0] || stage.skills[1] || "problem solving";
  return [
    { category: "Learn" as const, difficulty: "Easy" as const, title: `Learn a ${stage.skills[0]} core concept`, description: `Spend focused time strengthening a key ${career.title} foundation.`, whyItMatters: `Core knowledge gives you confidence for the more advanced ${career.title} work ahead.`, instructions: [`Choose one beginner-friendly ${stage.skills[0]} lesson.`, "Write down three ideas you understand.", "Capture one question to explore next."], time: "30 min", xp: 25, skill: stage.skills[0] },
    { category: "Practice" as const, difficulty: "Medium" as const, title: `Practice ${subject}`, description: `Use deliberate practice to make ${subject} more natural and useful.`, whyItMatters: `Practice turns knowledge into a dependable ${career.title} skill.`, instructions: [`Set a 40-minute focus timer.`, `Complete 5–10 ${subject} practice prompts.`, "Review one answer you would improve."], time: "45 min", xp: 50, skill: subject },
    { category: "Challenge" as const, difficulty: "Hard" as const, title: `Solve a ${personalSkill} challenge`, description: "Work through one meaningful problem and explain your reasoning.", whyItMatters: "Strong problem solving helps you apply knowledge beyond memorised examples.", instructions: ["Pick one challenge at the right difficulty.", "Work without looking up the answer first.", "Write a short reflection on your approach."], time: "60 min", xp: 80, skill: personalSkill },
    { category: "Project" as const, difficulty: "Project" as const, title: `Build a ${career.title} mini project`, description: `Create a small outcome that demonstrates this week's ${stage.title.toLowerCase()} progress.`, whyItMatters: "Projects become evidence of your skills and make your learning visible.", instructions: ["Choose a small, finishable idea.", "Build a first version in one focused session.", "Save a screenshot, note, or link for your portfolio."], time: "1–2 hours", xp: 150, skill: "Projects" },
  ];
}

export function getWeeklyTasks(state: RoadmapState, profile: InnovateXProfile, weekKey = getCurrentWeek()) {
  const existing = state.weeklyTasks[weekKey];
  if (existing) return { state, tasks: existing };

  const stage = activeStage(state.stages);
  if (!stage || stage.state === "completed") return { state, tasks: [] };
  const blueprints = taskBlueprint(state.career, stage, profile);
  const tasks = blueprints.map((task, index) => ({
    id: `${weekKey}-${stage.id}-task-${index + 1}`,
    title: task.title,
    description: task.description,
    whyItMatters: task.whyItMatters,
    instructions: task.instructions,
    category: task.category,
    estimatedTime: task.time,
    xpReward: task.xp,
    difficulty: task.difficulty,
    dueDate: addDays(weekKey, 6),
    weekKey,
    relatedSkill: task.skill,
    stageId: stage.id,
    milestoneId: stage.milestones[index]?.id ?? stage.milestones[0].id,
  }));
  const nextState = { ...state, weeklyTasks: { ...state.weeklyTasks, [weekKey]: tasks } };
  saveRoadmap(nextState);
  return { state: nextState, tasks };
}

function updateAchievements(progress: UserProgress, stages: RoadmapStage[], weekTasks: WeeklyTask[]) {
  const allWeekComplete = weekTasks.length > 0 && weekTasks.every((task) => progress.completedTaskIds.includes(task.id));
  const completedMilestones = stages.flatMap((stage) => stage.milestones).filter((milestone) => milestone.completed).length;
  const completedStages = stages.filter((stage) => stage.state === "completed").length;
  return progress.achievements.map((achievement) => ({
    ...achievement,
    unlocked: achievement.unlocked
      || (achievement.id === "first-step" && progress.totalTasksCompleted >= 1)
      || (achievement.id === "week-warrior" && allWeekComplete)
      || (achievement.id === "builder" && progress.projectsCompleted >= 1)
      || (achievement.id === "skill-unlocked" && completedMilestones >= 1)
      || (achievement.id === "stage-complete" && completedStages >= 1),
  }));
}

export function completeTask(state: RoadmapState, taskId: string, today = toDateKey(new Date())): RoadmapState {
  if (state.progress.completedTaskIds.includes(taskId)) return state;
  const task = Object.values(state.weeklyTasks).flat().find((item) => item.id === taskId);
  if (!task) return state;

  const stages = state.stages.map((stage) => {
    if (stage.id !== task.stageId) return stage;
    const milestones = stage.milestones.map((milestone) => milestone.id === task.milestoneId ? { ...milestone, completed: true } : milestone);
    const stageComplete = milestones.every((milestone) => milestone.completed);
    return { ...stage, milestones, state: stageComplete ? "completed" as const : "unlocked" as const };
  }).map((stage, index, allStages) => {
    if (index === 0 || allStages[index - 1].state === "completed") {
      return stage.state === "locked" ? { ...stage, state: "unlocked" as const } : stage;
    }
    return stage;
  });

  const yesterday = addDays(today, -1);
  const progress: UserProgress = {
    ...state.progress,
    totalXp: state.progress.totalXp + task.xpReward,
    totalTasksCompleted: state.progress.totalTasksCompleted + 1,
    projectsCompleted: state.progress.projectsCompleted + (task.category === "Project" ? 1 : 0),
    completedTaskIds: [...state.progress.completedTaskIds, task.id],
    lastCompletionDate: today,
    currentStreak: state.progress.lastCompletionDate === today
      ? state.progress.currentStreak
      : state.progress.lastCompletionDate === yesterday
        ? state.progress.currentStreak + 1
        : 1,
  };
  const weekTasks = state.weeklyTasks[task.weekKey] ?? [];
  const nextProgress = { ...progress, achievements: updateAchievements(progress, stages, weekTasks) };
  const nextState = { ...state, stages, progress: nextProgress };
  saveRoadmap(nextState);
  return nextState;
}

export function calculateProgress(state: RoadmapState, weekKey = getCurrentWeek()): RoadmapMetrics {
  const milestones = state.stages.flatMap((stage) => stage.milestones);
  const completedMilestones = milestones.filter((milestone) => milestone.completed).length;
  const totalMilestones = milestones.length;
  const completedTaskCount = state.progress.completedTaskIds.length;
  const taskContribution = Math.min(20, completedTaskCount * 2);
  const milestoneContribution = totalMilestones ? (completedMilestones / totalMilestones) * 80 : 0;
  const weekTasks = state.weeklyTasks[weekKey] ?? [];
  const completedWeekTasks = weekTasks.filter((task) => state.progress.completedTaskIds.includes(task.id));
  const weekXp = completedWeekTasks.reduce((total, task) => total + task.xpReward, 0);
  const level = Math.floor(state.progress.totalXp / 250) + 1;
  const levelStart = (level - 1) * 250;
  return {
    overallProgress: Math.round(Math.min(100, milestoneContribution + taskContribution)),
    completedMilestones,
    totalMilestones,
    currentWeekXp: weekXp,
    currentWeekCompleted: completedWeekTasks.length,
    currentWeekTotal: weekTasks.length,
    level,
    xpIntoLevel: state.progress.totalXp - levelStart,
    xpForNextLevel: 250,
  };
}

export function getLongTermGoal(state: RoadmapState, progress: number): LongTermGoal {
  return {
    id: `goal-${state.career.id}`,
    title: `Become a ${state.career.title}`,
    description: state.career.description,
    targetDate: "A focused long-term journey",
    progress,
    milestones: state.stages.flatMap((stage) => stage.milestones),
  };
}

export function getHistory(state: RoadmapState, currentWeek = getCurrentWeek()) {
  return Object.entries(state.weeklyTasks)
    .filter(([weekKey]) => weekKey !== currentWeek)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 2)
    .map(([weekKey, tasks]) => {
      const completed = tasks.filter((task) => state.progress.completedTaskIds.includes(task.id));
      return { weekKey, completed: completed.length, total: tasks.length, xp: completed.reduce((sum, task) => sum + task.xpReward, 0) };
    });
}
