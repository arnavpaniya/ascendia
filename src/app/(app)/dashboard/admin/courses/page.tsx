"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { GlowCard } from "@/components/ui/GlowCard";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Plus, Edit, Trash2, GripVertical, CheckCircle, Database } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getAllCourses, getAllEnrollments, getAllLessons, replaceCourseLessons, upsertCourse } from "@/lib/mock-data";

interface LessonLocal { id: string; title: string; video_url: string; content_md: string; }

function SortableLessonItem({ lesson, onEdit, onDelete }: { lesson: LessonLocal; onEdit: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lesson.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center gap-4 bg-[#161820] border ${isDragging ? "border-[#7c6df0]" : "border-white/5"} p-4 rounded-xl relative group`}>
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-white/30 hover:text-white/80 transition-colors p-2 -m-2 outline-none">
        <GripVertical className="w-5 h-5" />
      </button>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{lesson.title}</p>
        <p className="text-xs text-white/40 truncate">{lesson.video_url}</p>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={onEdit} className="p-2 hover:bg-[#38bdf8]/10 text-[#38bdf8] rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
        <button type="button" onClick={onDelete} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

export default function AdminCourseManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [difficulty, setDifficulty] = useState("beginner");
  const [publish, setPublish] = useState(false);
  const [lessons, setLessons] = useState<LessonLocal[]>([]);
  
  // Lesson Draft State
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonVideo, setLessonVideo] = useState("");
  const [lessonMd, setLessonMd] = useState("");

  const { data: courses, isLoading, refetch } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      const coursesSnap = await getAllCourses();
      const lessonsSnap = await getAllLessons();
      const enrollsSnap = await getAllEnrollments();
      
      const lessons = lessonsSnap.map((lesson) => ({ ...lesson } as any));
      const enrolls = enrollsSnap;

      const data = coursesSnap.map((entry) => {
        const c = { ...entry } as any;
        c.lessons = [{ count: lessons.filter((l: any) => l.course_id === c.id).length }];
        c.enrollments = [{ count: enrolls.filter((e: any) => e.course_id === c.id).length }];
        return c;
      });
      data.sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      return data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const activeCourseId = await upsertCourse({
        id: editingCourseId ?? undefined,
        title,
        description,
        category,
        difficulty,
        is_published: publish,
        thumbnail_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80",
      });

      await replaceCourseLessons(
        activeCourseId,
        lessons.map((lesson, index) => ({
          id: lesson.id,
          title: lesson.title,
          video_url: lesson.video_url,
          content_md: lesson.content_md,
          duration_sec: 900,
          xp_reward: 40,
          order_index: index,
        })),
      );
    },
    onSuccess: () => {
      setIsModalOpen(false);
      resetForm();
      refetch();
    }
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setLessons((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const saveDraftLesson = () => {
    if (!lessonTitle) return;
    
    if (activeLessonId) {
      setLessons(prev => prev.map(l => l.id === activeLessonId ? { ...l, title: lessonTitle, video_url: lessonVideo, content_md: lessonMd } : l));
    } else {
      setLessons(prev => [...prev, { id: `draft-${Date.now()}`, title: lessonTitle, video_url: lessonVideo, content_md: lessonMd }]);
    }
    setLessonTitle(""); setLessonVideo(""); setLessonMd(""); setActiveLessonId(null);
  };

  const loadCourseForEditing = async (courseId: string) => {
    setEditingCourseId(courseId);
    
    const cData = courses?.find((c: any) => c.id === courseId);
    if (cData) {
      setTitle(cData.title); setDescription(cData.description || ""); setCategory(cData.category || "Frontend");
      setDifficulty(cData.difficulty || "beginner"); setPublish(cData.is_published || false);
    }

    const lessonsSnap = await getAllLessons();
    const lData = lessonsSnap.map((lesson) => ({ ...lesson } as any))
      .filter((l: any) => l.course_id === courseId)
      .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
    
    if (lData) {
      setLessons(lData.map((l: any) => ({ id: l.id, title: l.title, video_url: l.video_url || "", content_md: l.content_md || "" })));
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingCourseId(null); setTitle(""); setDescription(""); setCategory("Frontend"); setDifficulty("beginner"); 
    setPublish(false); setLessons([]); setLessonTitle(""); setLessonVideo(""); setLessonMd(""); setActiveLessonId(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-syne font-bold tracking-tight">Ascendia Syllabus CMS</h1>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="px-6 py-2.5 bg-[#7c6df0] hover:bg-[#6c63ff] font-bold rounded-full transition-colors flex items-center gap-2 text-sm shadow-[0_0_20px_rgba(124,109,240,0.3)]">
          <Plus className="w-4 h-4" /> Build Advanced Course
        </button>
      </div>

      <GlowCard className="p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#7c6df0]" /></div>
        ) : (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#161820]/80 text-white/50 uppercase font-bold text-xs">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Modules</th>
                <th className="px-6 py-4">Enrollments</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {courses?.map((course: any) => (
                <tr key={course.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-semibold">{course.title}</td>
                  <td className="px-6 py-4"><span className="bg-white/10 px-2 py-1 rounded text-white/70">{course.category || 'General'}</span></td>
                  <td className="px-6 py-4">
                    {course.is_published ? <span className="text-[#34d399] flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Publ.</span> : <span className="text-white/40">Draft</span>}
                  </td>
                  <td className="px-6 py-4 text-white/60">{course.lessons[0]?.count || 0}</td>
                  <td className="px-6 py-4 text-white/60">{course.enrollments[0]?.count || 0}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => loadCourseForEditing(course.id)} className="text-[#38bdf8] hover:bg-[#38bdf8]/10 px-3 py-1.5 rounded transition-colors font-medium">Edit Tree &rarr;</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlowCard>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="relative w-full max-w-4xl bg-[#07080f] border-l border-white/10 shadow-2xl h-screen overflow-y-auto hide-scrollbar flex flex-col">
              
              <div className="sticky top-0 bg-[#07080f]/90 backdrop-blur-xl border-b border-white/10 p-6 flex items-center justify-between z-10 shrink-0">
                <h2 className="text-2xl font-syne font-bold flex items-center gap-3"><Database className="w-6 h-6 text-[#7c6df0]" /> {editingCourseId ? "Edit Course Architecture" : "Draft New Course"}</h2>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} className="form-checkbox text-[#34d399] bg-transparent border-white/20 rounded h-4 w-4" />
                    Published to Public
                  </label>
                  <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="px-8 py-2.5 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2">
                    {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />} Save Architecture
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-12">
                <section className="space-y-6 bg-[#0f1018] p-8 rounded-2xl border border-white/5">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#7c6df0]">1. Core Metadata</h3>
                  <div className="space-y-4">
                    <div><label className="text-xs text-white/50 mb-1 block">Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#161820] border-transparent rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#7c6df0]" placeholder="Advanced Cloud Deployment..." /></div>
                    <div><label className="text-xs text-white/50 mb-1 block">Rich Description</label>
                      <div data-color-mode="dark" className="rounded-xl overflow-hidden border border-[#161820]">
                        <MDEditor value={description} onChange={val => setDescription(val || "")} className="bg-[#161820]" height={200} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-xs text-white/50 mb-1 block">Category</label><select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#161820] border-transparent rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#7c6df0] appearance-none"><option>Frontend</option><option>Backend</option><option>AI</option></select></div>
                      <div><label className="text-xs text-white/50 mb-1 block">Difficulty</label><select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full bg-[#161820] border-transparent rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#7c6df0] appearance-none"><option>beginner</option><option>intermediate</option><option>advanced</option></select></div>
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                   <div className="flex justify-between items-end border-b border-white/10 pb-4">
                     <div>
                       <h3 className="text-sm font-bold uppercase tracking-widest text-[#38bdf8]">2. Curriculum Builder</h3>
                       <p className="text-sm text-white/40 mt-1">Drag and drop active modules to reorder</p>
                     </div>
                   </div>

                   <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                     <SortableContext items={lessons} strategy={verticalListSortingStrategy}>
                       <div className="space-y-3">
                         {lessons.map(lesson => (
                           <SortableLessonItem 
                             key={lesson.id} 
                             lesson={lesson} 
                             onEdit={() => { setActiveLessonId(lesson.id); setLessonTitle(lesson.title); setLessonVideo(lesson.video_url); setLessonMd(lesson.content_md); }}
                             onDelete={() => setLessons(p => p.filter(l => l.id !== lesson.id))}
                           />
                         ))}
                       </div>
                     </SortableContext>
                   </DndContext>

                   {/* Draft Module Factory */}
                   <div className="mt-8 border border-dashed border-[#7c6df0]/30 bg-[#7c6df0]/5 p-6 rounded-2xl space-y-4">
                      <h4 className="font-syne font-semibold text-[#7c6df0] text-sm flex items-center gap-2"><Plus className="w-4 h-4"/> {activeLessonId ? "Editing Focus Module" : "Draft New Module"}</h4>
                      <input type="text" value={lessonTitle} onChange={e=>setLessonTitle(e.target.value)} placeholder="Module Title (e.g. Redux Toolkit)" className="w-full bg-[#161820] border-transparent rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#7c6df0]" />
                      <input type="text" value={lessonVideo} onChange={e=>setLessonVideo(e.target.value)} placeholder="Video URL (YouTube/MP4)" className="w-full bg-[#161820] border-transparent rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#7c6df0]" />
                      <div data-color-mode="dark" className="rounded-xl overflow-hidden border border-[#161820]">
                        <MDEditor value={lessonMd} onChange={val => setLessonMd(val || "")} className="bg-[#161820]" height={200} preview="edit" />
                      </div>
                      <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => { setActiveLessonId(null); setLessonTitle(""); setLessonVideo(""); setLessonMd(""); }} className="px-6 py-2 rounded-full text-white/50 hover:bg-white/5 transition-colors text-sm font-semibold">Clear</button>
                        <button onClick={saveDraftLesson} disabled={!lessonTitle} className="px-6 py-2 bg-[#7c6df0] hover:bg-[#6c63ff] disabled:opacity-50 rounded-full font-bold text-sm transition-colors shadow-lg">Stage Module</button>
                      </div>
                   </div>
                </section>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
