"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { useGamification } from "@/hooks/useGamification";
import { Loader2, ArrowLeft, CheckCircle, PlayCircle, Trophy, Sparkles } from "lucide-react";
import ReactPlayer from "react-player";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import Link from "next/link";
import { AIChatPanel } from "@/components/ai/AIChatPanel";
import { XP_REWARDS } from "@/utils/xp.utils";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { completeLesson, getCourseById, getLessonsByCourse, getProgressByUser } from "@/lib/mock-data";

export default function CoursePlayer() {
  const { courseId, lessonId } = useParams();
  const { profile } = useAuthStore();
  const { fireConfetti } = useGamification();

  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const playerRef = useRef<any>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['lesson-player', courseId, lessonId],
    enabled: !!courseId && !!lessonId && !!profile?.id,
    queryFn: async () => {
      const course = await getCourseById(courseId as string);
      const lessons = await getLessonsByCourse(courseId as string);
      const progress = await getProgressByUser(profile!.id);
      
      const currentLesson = lessons?.find(l => l.id === lessonId);
      const currentProgress = progress?.find((p: any) => p.lesson_id === lessonId);
      
      return { course, lessons: lessons || [], progress: progress || [], currentLesson, currentProgress };
    }
  });

  const completeLessonMutation = useMutation({
    mutationFn: async () => {
      if (!data?.currentLesson) return;
      await completeLesson({
        userId: profile!.id,
        courseId: courseId as string,
        lessonId: lessonId as string,
        xpReward: (data.currentLesson as any).xp_reward || XP_REWARDS.complete_lesson,
      });
    },
    onSuccess: () => {
      fireConfetti();
      refetch();
    }
  });

  // Track watch time every 10 seconds locally and lazily push to DB (simulated here for safety)
  useEffect(() => {
    const handleProgress = async (state: { playedSeconds: number }) => {
      if (state.playedSeconds > 0 && Math.floor(state.playedSeconds) % 15 === 0) {
          // In full production, debounced DB upserts go here
      }
    };
    // hook to player `onProgress`
  }, []);

  if (isLoading || !data) return <div className="h-[80vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#7c6df0]" /></div>;
  if (!data.currentLesson) return <div className="text-center p-12 text-white/50">Lesson not found or missing access.</div>;

  const completedSet = new Set(data.progress.filter((p: any) => p.completed).map((p: any) => p.lesson_id));
  const isCurrentlyCompleted = completedSet.has(data.currentLesson.id);

  const Player = ReactPlayer as any;

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-100px)] animate-in fade-in duration-500 relative">
      <AIChatPanel 
        isOpen={aiPanelOpen} 
        onClose={() => setAiPanelOpen(false)} 
        courseContext={data.course}
        lessonContext={data.currentLesson}
      />

      {/* Main Video & Content Area (Left) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto hide-scrollbar rounded-2xl bg-[#0f1018] border border-white/5 relative glass">
        
        {/* React Player Wrapper */}
        <div className="relative w-full aspect-video bg-black shrink-0 border-b border-white/5">
          <Player 
            ref={playerRef}
            url={(data.currentLesson as any).video_url} 
            width="100%" 
            height="100%" 
            controls 
            playing={false}
          />
        </div>

        {/* Content Body */}
        <div className="p-8 md:p-12 pb-24 flex-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-white/5 pb-8">
            <div>
              <Link href={`/courses/${courseId}`} className="text-[#7c6df0] hover:text-[#6c63ff] font-medium text-sm flex items-center gap-2 mb-3">
                 <ArrowLeft className="w-4 h-4" /> {(data.course as any)?.title}
              </Link>
              <h1 className="text-3xl font-syne font-bold">{(data.currentLesson as any).title}</h1>
            </div>
            
            <div className="shrink-0 flex items-center gap-4 w-full md:w-auto">
              {!isCurrentlyCompleted ? (
                <button
                  onClick={() => completeLessonMutation.mutate()}
                  disabled={completeLessonMutation.isPending}
                  className="bg-[#34d399] hover:bg-[#10b981] text-black font-bold px-8 py-3 rounded-full flex items-center justify-center gap-2 transition-colors w-full md:w-auto shadow-[0_0_20px_rgba(52,211,153,0.3)] disabled:opacity-50"
                >
                  {completeLessonMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle className="w-5 h-5" /> Mark as Completed</>}
                </button>
              ) : (
                <div className="bg-[#161820] text-[#34d399] font-medium border border-[#34d399]/20 px-8 py-3 rounded-full flex items-center justify-center gap-2 w-full md:w-auto">
                  <CheckCircle className="w-5 h-5" /> Mastered
                </div>
              )}
            </div>
          </div>

          <div className="prose prose-invert prose-p:text-white/70 prose-headings:font-syne prose-headings:text-white prose-a:text-[#38bdf8] max-w-none">
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {(data.currentLesson as any).content_md || (data.currentLesson as any).description || "*No detailed markdown content found for this lesson.*"}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Sidebar Lesson Playlist (Right) */}
      <div className="w-full xl:w-80 shrink-0 flex flex-col gap-4">
        
        {/* Floating AI Bubble Trigger */}
        <button 
          onClick={() => setAiPanelOpen(true)}
          className="w-full glass bg-gradient-to-r from-[#7c6df0]/20 to-[#f472b6]/10 hover:from-[#7c6df0]/30 hover:to-[#f472b6]/20 border border-[#7c6df0]/30 p-5 rounded-2xl flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c6df0] to-[#f472b6] flex items-center justify-center shadow-[0_0_15px_rgba(124,109,240,0.5)]">
               <Sparkles className="w-5 h-5 text-white" />
             </div>
             <div className="text-left">
               <h4 className="font-syne font-bold text-sm">Ask Aria AI</h4>
               <p className="text-[10px] text-white/60">Trained on this lesson</p>
             </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
             <ArrowLeft className="w-4 h-4 rotate-180" />
          </div>
        </button>

        <div className="glass rounded-2xl border border-white/5 flex-1 flex flex-col overflow-hidden bg-[#0f1018]">
          <div className="p-5 border-b border-white/5 bg-[#161820]/50 shrink-0">
            <h3 className="font-syne font-bold">Course Modules</h3>
            <div className="flex items-center justify-between text-xs mt-2 font-medium">
               <span className="text-white/50">{completedSet.size} / {data.lessons.length} computed</span>
               <span className="text-[#f59e0b] flex items-center gap-1"><Trophy className="w-3 h-3" /> XP Active</span>
            </div>
            <ProgressBar progress={Math.round((completedSet.size / (data.lessons.length || 1)) * 100)} height="h-1.5" className="mt-4" />
          </div>
          
          <div className="overflow-y-auto flex-1 p-2 space-y-1 hide-scrollbar">
            {data.lessons.map((l, i) => {
              const active = l.id === lessonId;
              const completed = completedSet.has(l.id);

              return (
                <Link key={l.id} href={`/courses/${courseId}/lesson/${l.id}`}>
                  <div className={`p-3 rounded-xl flex items-start gap-3 transition-colors ${active ? 'bg-[#6c63ff]/20 border border-[#6c63ff]/30' : 'hover:bg-white/5 border border-transparent'}`}>
                    <div className="shrink-0 mt-0.5">
                      {completed ? (
                        <CheckCircle className={`w-4 h-4 ${active ? 'text-[#38bdf8]' : 'text-[#34d399]'}`} />
                      ) : active ? (
                        <PlayCircle className="w-4 h-4 text-[#7c6df0]" />
                      ) : (
                        <span className="w-4 h-4 flex items-center justify-center text-[10px] font-mono text-white/30">{i + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${active ? 'text-white' : completed ? 'text-white/70' : 'text-white/50'}`}>{(l as any).title}</p>
                      <p className="text-[10px] text-white/40 mt-1">{Math.floor(((l as any).duration_sec || 0)/60)}m</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
