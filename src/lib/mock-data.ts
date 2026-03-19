"use client";

import type { AppUserRole, UserProfile } from "@/features/auth/types";

export interface DemoCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  thumbnail_url: string;
  video_url?: string;
  is_published: boolean;
  created_at: string;
  created_by?: string;
}

export interface DemoLesson {
  id: string;
  course_id: string;
  title: string;
  video_url: string;
  content_md: string;
  order_index: number;
  duration_sec: number;
  xp_reward?: number;
}

interface DemoEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  created_at: string;
}

interface DemoProgress {
  id: string;
  user_id: string;
  course_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at?: string;
}

interface DemoStore {
  users: UserProfile[];
  courses: DemoCourse[];
  lessons: DemoLesson[];
  enrollments: DemoEnrollment[];
  progress: DemoProgress[];
}

const STORAGE_KEY = "ascendia.demo.data";

const seededCourses: DemoCourse[] = [
  {
    id: "course-frontend",
    title: "Frontend Foundations",
    description: "HTML, CSS, React, and modern UI architecture in one guided track.",
    category: "Frontend",
    difficulty: "beginner",
    thumbnail_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80",
    is_published: true,
    created_at: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "course-backend",
    title: "Backend Systems",
    description: "APIs, databases, queues, and deployment for production systems.",
    category: "Backend",
    difficulty: "intermediate",
    thumbnail_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
    is_published: true,
    created_at: "2026-03-05T10:00:00.000Z",
  },
  {
    id: "course-ai",
    title: "Applied AI Workflows",
    description: "Prompting, retrieval, evaluation, and shipping practical AI features.",
    category: "AI",
    difficulty: "advanced",
    thumbnail_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
    is_published: true,
    created_at: "2026-03-08T10:00:00.000Z",
  },
];

const seededLessons: DemoLesson[] = [
  {
    id: "lesson-html",
    course_id: "course-frontend",
    title: "HTML Structure and Semantics",
    video_url: "https://www.youtube.com/watch?v=UB1O30fR-EE",
    content_md: "## HTML Structure\nBuild accessible page structure with semantic tags and content hierarchy.",
    order_index: 0,
    duration_sec: 900,
    xp_reward: 30,
  },
  {
    id: "lesson-react",
    course_id: "course-frontend",
    title: "React Component Patterns",
    video_url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
    content_md: "## React Patterns\nCompose interfaces with state, props, and reusable component boundaries.",
    order_index: 1,
    duration_sec: 1260,
    xp_reward: 40,
  },
  {
    id: "lesson-api",
    course_id: "course-backend",
    title: "Designing REST APIs",
    video_url: "https://www.youtube.com/watch?v=-MTSQjw5DrM",
    content_md: "## API Design\nCover routes, validation, status codes, and resource modeling.",
    order_index: 0,
    duration_sec: 1140,
    xp_reward: 35,
  },
  {
    id: "lesson-db",
    course_id: "course-backend",
    title: "Database Modeling",
    video_url: "https://www.youtube.com/watch?v=ztHopE5Wnpc",
    content_md: "## Data Modeling\nMap entities, relations, indexes, and read patterns.",
    order_index: 1,
    duration_sec: 1320,
    xp_reward: 45,
  },
  {
    id: "lesson-rag",
    course_id: "course-ai",
    title: "Retrieval-Augmented Generation",
    video_url: "https://www.youtube.com/watch?v=T-D1OfcDW1M",
    content_md: "## RAG Basics\nGround responses with retrieval, chunking, and ranking strategies.",
    order_index: 0,
    duration_sec: 1500,
    xp_reward: 50,
  },
  {
    id: "lesson-evals",
    course_id: "course-ai",
    title: "Evaluating AI Outputs",
    video_url: "https://www.youtube.com/watch?v=8l8fpR7xMEQ",
    content_md: "## AI Evals\nMeasure usefulness, failure modes, and regression risk before launch.",
    order_index: 1,
    duration_sec: 1380,
    xp_reward: 55,
  },
];

const initialStore: DemoStore = {
  users: [],
  courses: seededCourses,
  lessons: seededLessons,
  enrollments: [],
  progress: [],
};

function hasWindow() {
  return typeof window !== "undefined";
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function readStore(): DemoStore {
  if (!hasWindow()) {
    return clone(initialStore);
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return clone(initialStore);
  }

  try {
    const parsed = JSON.parse(raw) as DemoStore;
    return {
      users: parsed.users ?? [],
      courses: parsed.courses ?? [],
      lessons: parsed.lessons ?? [],
      enrollments: parsed.enrollments ?? [],
      progress: parsed.progress ?? [],
    };
  } catch {
    return clone(initialStore);
  }
}

function writeStore(store: DemoStore) {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function ensureDemoData() {
  const store = readStore();
  if (store.courses.length === 0 || store.lessons.length === 0) {
    writeStore(clone(initialStore));
  }
}

export async function getStoredUserProfile(userId: string) {
  ensureDemoData();
  const store = readStore();
  return store.users.find((user) => user.id === userId) ?? null;
}

export function saveUserProfile(profile: UserProfile) {
  const store = readStore();
  const existing = store.users.findIndex((user) => user.id === profile.id);

  if (existing >= 0) {
    store.users[existing] = profile;
  } else {
    store.users.push(profile);
  }

  writeStore(store);
}

export async function getPublishedCourses() {
  ensureDemoData();
  return readStore().courses.filter((course) => course.is_published);
}

export async function getAllCourses() {
  ensureDemoData();
  return readStore().courses.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
}

export async function getCourseById(courseId: string) {
  ensureDemoData();
  return readStore().courses.find((course) => course.id === courseId) ?? null;
}

export async function getLessonsByCourse(courseId: string) {
  ensureDemoData();
  return readStore()
    .lessons
    .filter((lesson) => lesson.course_id === courseId)
    .sort((a, b) => a.order_index - b.order_index);
}

export async function getAllLessons() {
  ensureDemoData();
  return readStore().lessons.sort((a, b) => a.order_index - b.order_index);
}

export async function getEnrollmentsByUser(userId: string) {
  ensureDemoData();
  return readStore().enrollments.filter((enrollment) => enrollment.user_id === userId);
}

export async function getAllEnrollments() {
  ensureDemoData();
  return readStore().enrollments;
}

export async function getProgressByUser(userId: string) {
  ensureDemoData();
  return readStore().progress.filter((item) => item.user_id === userId);
}

export async function enrollInCourse(userId: string, courseId: string) {
  const store = readStore();
  const alreadyEnrolled = store.enrollments.some(
    (enrollment) => enrollment.user_id === userId && enrollment.course_id === courseId,
  );

  if (!alreadyEnrolled) {
    store.enrollments.push({
      id: `${userId}-${courseId}`,
      user_id: userId,
      course_id: courseId,
      created_at: new Date().toISOString(),
    });
    writeStore(store);
  }
}

export async function completeLesson(input: {
  userId: string;
  courseId: string;
  lessonId: string;
  xpReward: number;
}) {
  const store = readStore();
  const progressId = `${input.userId}-${input.lessonId}`;
  const existingProgress = store.progress.findIndex((item) => item.id === progressId);
  const existingUser = store.users.findIndex((user) => user.id === input.userId);

  if (existingProgress >= 0) {
    store.progress[existingProgress] = {
      ...store.progress[existingProgress],
      completed: true,
      completed_at: new Date().toISOString(),
    };
  } else {
    store.progress.push({
      id: progressId,
      user_id: input.userId,
      course_id: input.courseId,
      lesson_id: input.lessonId,
      completed: true,
      completed_at: new Date().toISOString(),
    });
  }

  if (existingUser >= 0) {
    const user = store.users[existingUser];
    store.users[existingUser] = {
      ...user,
      xp: user.xp + input.xpReward,
      level: Math.max(user.level, Math.floor((user.xp + input.xpReward) / 100) + 1),
      last_active: new Date().toISOString(),
    };
  }

  writeStore(store);
}

export async function getAllUsers() {
  ensureDemoData();
  return readStore().users.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
}

export async function updateUserRole(userId: string, role: AppUserRole) {
  const store = readStore();
  const target = store.users.find((user) => user.id === userId);

  if (!target) {
    return;
  }

  target.role = role;
  target.last_active = new Date().toISOString();
  writeStore(store);
}

export async function upsertCourse(input: Omit<DemoCourse, "id" | "created_at"> & { id?: string }) {
  const store = readStore();
  const now = new Date().toISOString();
  const id = input.id ?? `course-${Date.now()}`;
  const course: DemoCourse = {
    id,
    created_at: input.id
      ? store.courses.find((item) => item.id === input.id)?.created_at ?? now
      : now,
    title: input.title,
    description: input.description,
    category: input.category,
    difficulty: input.difficulty,
    thumbnail_url: input.thumbnail_url,
    video_url: input.video_url,
    is_published: input.is_published,
    created_by: input.created_by,
  };

  const existing = store.courses.findIndex((item) => item.id === id);
  if (existing >= 0) {
    store.courses[existing] = course;
  } else {
    store.courses.push(course);
  }

  writeStore(store);
  return course.id;
}

export async function replaceCourseLessons(courseId: string, lessons: Array<Omit<DemoLesson, "course_id">>) {
  const store = readStore();
  store.lessons = store.lessons.filter((lesson) => lesson.course_id !== courseId);
  store.lessons.push(
    ...lessons.map((lesson, index) => ({
      ...lesson,
      id: lesson.id.startsWith("draft-") ? `lesson-${Date.now()}-${index}` : lesson.id,
      course_id: courseId,
      order_index: index,
    })),
  );
  writeStore(store);
}

export async function deleteCourse(courseId: string) {
  const store = readStore();
  store.courses = store.courses.filter((course) => course.id !== courseId);
  store.lessons = store.lessons.filter((lesson) => lesson.course_id !== courseId);
  store.enrollments = store.enrollments.filter((enrollment) => enrollment.course_id !== courseId);
  store.progress = store.progress.filter((item) => item.course_id !== courseId);
  writeStore(store);
}
