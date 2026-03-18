"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/auth.store";
import { Loader2, ArrowLeft, PlayCircle, Lock, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useGamification } from "@/hooks/useGamification";

export default function CourseOverview() {
  const { courseId } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const { profile } = useAuthStore();
  const { fireConfetti } = useGamification();

  const { data: courseData, isLoading, refetch } = useQuery({
    queryKey: ['course', courseId],
    enabled: !!courseId && !!profile?.id,
    queryFn: async () => {
      const { data: course } = await supabase.from('courses').select('*').eq('id', courseId).single();
      const { data: lessons } = await supabase.from('lessons').select('*').eq('course_id', courseId).order('order_index', { ascending: true });
      const { data: enrollment } = await supabase.from('enrollments').select('*').eq('course_id', courseId).eq('user_id', profile!.id).maybeSingle();
      const { data: progress } = await supabase.from('progress').select('*').eq('course_id', courseId).eq('user_id', profile!.id);
      
      return {
        course,
        lessons: lessons || [],
        enrollment,
        progress: progress || []
      };
    }
  });

  const enrollMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('enrollments').insert({
        user_id: profile!.id,
        course_id: courseId as string
      });
      if (error) throw error;
    },
    onSuccess: () => {
      fireConfetti();
      refetch();
    }
  });

  if (isLoading || !courseData) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#7c6df0]" /></div>;

  const { course, lessons, enrollment, progress } = courseData;
  const completedIds = new Set(progress.filter(p => p.completed).map(p => p.lesson_id));
  const progressPercent = lessons.length > 0 ? Math.round((completedIds.size / lessons.length) * 100) : 0;
  
  // Find the first uncompleted lesson, or default to the first
  const nextLesson = lessons.find(l => !completedIds.has(l.id)) || lessons[0];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <Link href="/courses" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </Link>

      {/* Hero Banner */}
      <div className="relative h-[300px] md:h-[400px] rounded-[2rem] overflow-hidden group border border-white/5 bg-[#0f1018]">
        <img src={course?.thumbnail_url || `https://images.unsplash.com/photo-1611974789855?w=1000&q=80`} alt={course?.title} className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080f] via-[#07080f]/80 to-transparent" />
        
        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
          <div className="flex gap-2 mb-4">
            <span className="bg-[#7c6df0]/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{course?.category || 'General'}</span>
            <span className="bg-[#38bdf8]/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{course?.difficulty}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-syne font-bold mb-4">{course?.title}</h1>
          <p className="max-w-2xl text-white/70 text-lg mb-8 line-clamp-2">{course?.description}</p>
          
          <div className="flex items-center gap-6">
            {!enrollment ? (
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => enrollMutation.mutate()}
                disabled={enrollMutation.isPending}
                className="bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold px-8 py-3.5 rounded-full flex items-center gap-2 transition-colors duration-300"
              >
                {enrollMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enroll Now in Course"}
              </motion.button>
            ) : (
              <div className="flex items-center gap-6 w-full md:w-auto">
                <Link href={`/courses/${courseId}/lesson/${nextLesson?.id}`}>
                  <motion.button 
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="bg-[#7c6df0] hover:bg-[#6c63ff] text-white font-bold px-8 py-3.5 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(124,109,240,0.4)] transition-all"
                  >
                    <PlayCircle className="w-5 h-5" /> Continue Learning
                  </motion.button>
                </Link>
                <div className="flex-1 md:w-48 hidden sm:block">
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span className="text-white/60">Your Progress</span>
                    <span className="text-[#34d399]">{progressPercent}%</span>
                  </div>
                  <ProgressBar progress={progressPercent} height="h-2" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Curriculum */}
      <div className="glass rounded-[2rem] p-8">
        <h2 className="text-2xl font-syne font-bold mb-6 flex items-center gap-3">
          Curriculum <span className="text-sm font-sans font-medium text-white/40 bg-white/5 px-3 py-1 rounded-full">{lessons.length} Modules</span>
        </h2>
        
        <div className="space-y-3">
          {lessons.map((lesson, idx) => {
            const isCompleted = completedIds.has(lesson.id);
            const isLocked = !enrollment;
            
            return (
              <div key={lesson.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors ${isCompleted ? 'bg-[#34d399]/5 border-[#34d399]/20' : 'bg-[#161820]/60 border-white/5 hover:border-white/10'}`}>
                <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-white/40 font-mono text-sm">
                  {idx + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold truncate ${isCompleted ? 'text-white' : 'text-white/80'}`}>{lesson.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-white/40 flex items-center gap-1"><Clock className="w-3 h-3" /> {Math.floor(lesson.duration_sec / 60)} min</span>
                    {isCompleted && <span className="text-xs text-[#34d399] flex items-center gap-1 font-medium"><CheckCircle className="w-3 h-3" /> Completed</span>}
                  </div>
                </div>

                <div className="shrink-0">
                  {isLocked ? (
                     <Lock className="w-5 h-5 text-white/20" />
                  ) : isCompleted ? (
                     <div className="w-8 h-8 rounded-full bg-[#34d399]/20 flex items-center justify-center border border-[#34d399]/30">
                       <CheckCircle className="w-4 h-4 text-[#34d399]" />
                     </div>
                  ) : (
                     <Link href={`/courses/${courseId}/lesson/${lesson.id}`}>
                       <button className="p-2.5 rounded-full bg-white/5 hover:bg-[#7c6df0]/20 text-[#7c6df0] transition-colors border border-white/5 hover:border-[#7c6df0]/30 outline-none">
                         <PlayCircle className="w-5 h-5" />
                       </button>
                     </Link>
                  )}
                </div>
              </div>
            )
          })}
          
          {lessons.length === 0 && (
             <div className="text-center py-12 text-white/40">
                This course currently has no lessons published.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
