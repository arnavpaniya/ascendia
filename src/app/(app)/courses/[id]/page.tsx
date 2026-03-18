"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CoursePlayerPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadCourse = async () => {
      const { data: authData } = await supabase.auth.getUser();
      
      const courseId = params.id as string;
      const { data: cData } = await supabase.from('courses').select('*').eq('id', courseId).single();
      
      if (cData) setCourse(cData);

      if (authData?.user) {
         const { data: pData } = await supabase.from('course_progress')
            .select('completed')
            .eq('user_id', authData.user.id)
            .eq('course_id', courseId)
            .single();
            
         if (pData?.completed) {
            setIsCompleted(true);
         }
      }
      setLoading(false);
    };
    loadCourse();
  }, [params.id, supabase]);

  const handleComplete = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    setIsCompleted(true); // Optimistic UI mapping
    await supabase.from('course_progress').upsert({
      user_id: user.id,
      course_id: course.id,
      completed: true,
      completed_at: new Date().toISOString()
    }, { onConflict: 'user_id, course_id' });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white/50">Establishing connection to datastream...</div>;
  }

  if (!course) {
    return <div className="min-h-screen flex items-center justify-center text-white/50">Course content module not found.</div>;
  }

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      <Link href="/courses" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Library
      </Link>
      
      <GlowCard className="overflow-hidden p-0 border-white/10 relative">
        <div className="aspect-video w-full bg-black relative">
          {course.video_url ? (
             <iframe 
               src={course.video_url.includes('youtube') || course.video_url.includes('youtu.be') ? course.video_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/') : course.video_url} 
               className="w-full h-full"
               allowFullScreen
               title="Course Video"
             />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/30 border border-dashed border-white/10 m-4 w-[calc(100%-32px)] h-[calc(100%-32px)] rounded-xl">
               No Video Source Available
            </div>
          )}
        </div>
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-syne font-bold mb-3">{course.title}</h1>
              <p className="text-white/60 leading-relaxed max-w-3xl">{course.description}</p>
            </div>
            <motion.div whileTap={{ scale: 0.95 }} className="shrink-0">
              <Button 
                onClick={handleComplete} 
                disabled={isCompleted}
                className={`h-12 px-6 ${isCompleted ? 'bg-green-500/20 text-green-400 border border-green-500/30' : ''}`}
                variant={isCompleted ? 'outline' : 'default'}
              >
                {isCompleted ? (
                   <><CheckCircle className="w-5 h-5 mr-2" /> Module Mastered</>
                ) : (
                   "Mark as Completed"
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </GlowCard>
    </div>
  );
}
