"use client";

import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { TiltCard } from "@/components/ui/TiltCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { StaggerList } from "@/components/ui/StaggerList";
import { useIntersectionReveal } from "@/hooks/useIntersectionReveal";
import { BookOpen, Target, Clock, Zap, Sparkles, Flame, Trophy } from "lucide-react";
import { OrbField } from "@/components/three/OrbField";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth.store";
import { useQuery } from "@tanstack/react-query";
import { calculateLevel } from "@/utils/xp.utils";
import Link from "next/link";
import { ActivityHeatmap } from "@/components/student/ActivityHeatmap";

export default function StudentDashboard() {
  const { ref: timelineRef, isInView: timelineInView } = useIntersectionReveal();
  
  const { profile } = useAuthStore();
  const supabase = createClient();

  const { data, isLoading } = useQuery({
    queryKey: ['student-dashboard-stats', profile?.id],
    enabled: !!profile?.id,
    queryFn: async () => {
      // Fetch all published courses
      const { data: courses } = await supabase.from('courses').select('*').eq('is_published', true).order('created_at', { ascending: false });
      
      // Fetch user enrollments + progress
      const { data: enrollments } = await supabase.from('enrollments').select('*').eq('user_id', profile!.id);
      const { data: progress } = await supabase.from('progress').select('*').eq('user_id', profile!.id);
      const { data: lessons } = await supabase.from('lessons').select('id, course_id');

      // Aggregate data
      const enrolledCourseIds = new Set(enrollments?.map(e => e.course_id));
      const completedLessonIds = new Set(progress?.filter(p => p.completed).map(p => p.lesson_id));

      const availableCourses = (courses || []).map(course => {
        const courseLessons = lessons?.filter(l => l.course_id === course.id) || [];
        const completedCourseLessons = courseLessons.filter(l => completedLessonIds.has(l.id));
        const progressPercent = courseLessons.length > 0 ? Math.round((completedCourseLessons.length / courseLessons.length) * 100) : 0;
        
        return {
          id: course.id,
          title: course.title,
          category: course.category,
          progress: progressPercent,
          enrolled: enrolledCourseIds.has(course.id),
          thumbnail: course.thumbnail_url || `https://images.unsplash.com/photo-1611974789855?w=500&q=80`
        };
      });

      return {
        completedLessons: completedLessonIds.size,
        totalEnrolled: enrollments?.length || 0,
        courses: availableCourses
      };
    }
  });

  const levelData = calculateLevel(profile?.xp || 0);

  const stats = [
    { label: "Enrolled Courses", value: data?.totalEnrolled || 0, icon: BookOpen, color: "#6c63ff" },
    { label: "Completed Lessons", value: data?.completedLessons || 0, icon: Zap, color: "#34d399" },
    { label: "Study Hours This Week", value: 12, icon: Clock, color: "#38bdf8" },
    { label: "Current Rank", value: levelData.currentLevel, icon: Trophy, color: "#f59e0b" },
  ];

  const firstName = profile?.full_name?.split(' ')[0] || "Valiant Scholar";

  return (
    <div className="relative min-h-screen">
      <OrbField />
      
      <div className="relative z-10 space-y-8 pb-12">
        {/* Header / XP Banner */}
        <div className="glass rounded-[2rem] p-8 md:p-10 relative overflow-hidden group border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#7c6df0]/10 via-[#38bdf8]/5 to-transparent pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#7c6df0] to-[#38bdf8] p-1 flex-shrink-0">
                <div className="w-full h-full rounded-full bg-[#0f1018] overflow-hidden">
                  <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.id || 'Felix'}&backgroundColor=transparent`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                  className="text-3xl md:text-4xl font-syne font-bold mb-2 tracking-tight"
                >
                  Welcome back, {firstName} 👋
                </motion.h1>
                <div className="flex items-center gap-3 text-sm font-medium">
                  <span className="text-[#f59e0b] bg-[#f59e0b]/10 px-3 py-1 rounded-full border border-[#f59e0b]/20 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4" /> Level {levelData.currentLevel} — {levelData.title}
                  </span>
                  <span className="text-[#f472b6] bg-[#f472b6]/10 px-3 py-1 rounded-full flex items-center gap-1">
                    <Flame className="w-4 h-4" /> {profile?.streak_days || 0} Day Streak
                  </span>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/3 bg-[#0f1018]/50 p-4 rounded-2xl border border-white/5 relative">
              <div className="flex justify-between text-sm mb-3 font-medium">
                <span className="text-white/80">{profile?.xp || 0} XP</span>
                <span className="text-white/60">
                  {levelData.nextLevelXp ? `${levelData.nextLevelXp - (profile?.xp || 0)} XP until 🏆` : "Max Level"}
                </span>
              </div>
              <ProgressBar progress={levelData.progressPercent} height="h-3" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <StaggerList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass glass-hover rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-36"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              <div className="flex justify-between items-start">
                <span className="text-white/60 text-sm font-medium">{stat.label}</span>
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-white/10 to-white/0 border border-white/10">
                  <stat.icon className="w-5 h-5 flex-shrink-0" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-4xl font-syne font-bold tracking-tight mt-auto">
                <AnimatedCounter to={stat.value} />
              </div>
            </motion.div>
          ))}
        </StaggerList>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-syne font-bold">Continue Learning</h2>
                <Link href="/courses" className="text-sm font-medium text-[#7c6df0] hover:text-white transition-colors">
                  See all courses &rarr;
                </Link>
              </div>
              
              <div className="flex overflow-x-auto pb-8 -mx-4 px-4 gap-6 snap-x hide-scrollbar">
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="min-w-[320px] h-[280px] glass rounded-[1.5rem] animate-pulse shrink-0" />
                  ))
                ) : data?.courses.length === 0 ? (
                  <div className="w-full p-12 text-center text-white/50 border border-white/5 rounded-3xl glass">
                    No active courses found. Navigate to Courses via the sidebar to access the curriculum.
                  </div>
                ) : (
                  data?.courses.map((course) => (
                    <Link href={`/courses/${course.id}`} key={course.id} className="block shrink-0 snap-center focus:outline-none group">
                      <TiltCard className="min-w-[300px] sm:min-w-[340px] transition-all duration-300 border border-white/5 hover:border-[#7c6df0]/40 rounded-[1.5rem] overflow-hidden bg-[#0f1018]">
                        <div className="h-44 relative bg-[#161820]">
                          <img src={course.thumbnail} alt={course.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1018] via-[#0f1018]/20 to-transparent" />
                          <div className="absolute top-4 left-4">
                            <span className="text-[10px] uppercase tracking-wider font-bold bg-[#7c6df0]/80 backdrop-blur text-white px-2.5 py-1 rounded-lg">
                              {course.category || "General"}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 relative">
                          <h3 className="font-syne font-bold text-xl mb-6 truncate leading-tight">{course.title}</h3>
                          
                          <div className="flex items-center justify-between mb-2 text-xs font-medium text-white/60">
                            <span>{course.progress}% Completed</span>
                            <span>{course.enrolled ? "Enrolled" : "Preview"}</span>
                          </div>
                          <ProgressBar progress={course.progress} height="h-2" />
                          
                          <div className="mt-6 flex justify-end">
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-white text-black font-semibold text-sm px-6 py-2.5 rounded-full flex items-center gap-2 group-hover:bg-[#7c6df0] group-hover:text-white transition-colors"
                            >
                              Continue &rarr;
                            </motion.button>
                          </div>
                        </div>
                      </TiltCard>
                    </Link>
                  ))
                )}
              </div>
            </section>

            {/* Configurable Mini Bar Chart */}
            <GlowCard className="border border-white/5 bg-gradient-to-br from-[#161820]/80 to-[#0f1018]/80">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-syne font-bold">Weekly Activity Heatmap</h2>
                <span className="text-xs font-mono text-white/40">LAST 30 DAYS</span>
              </div>
              <ActivityHeatmap />
            </GlowCard>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            
            {/* AI Tutor Quick Access */}
            <Link href="/courses">
              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                className="w-full glass rounded-[1.5rem] p-6 relative overflow-hidden border border-white/10 group cursor-pointer mb-6"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#7c6df0]/20 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-start gap-4 mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#7c6df0] to-[#f472b6] flex items-center justify-center shadow-[0_0_20px_rgba(124,109,240,0.3)]">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-syne font-bold text-lg leading-tight mb-1">AI Tutor Access</h3>
                    <p className="text-xs text-white/60">Ask anything, anytime.</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-[#7c6df0] group-hover:text-white transition-colors flex items-center gap-2">
                  Launch Aria AI Chat &rarr;
                </div>
              </motion.div>
            </Link>

            <GlowCard className="h-[400px]">
              <h2 className="text-xl font-syne font-bold mb-6">Upcoming Schedule</h2>
              <div ref={timelineRef as any} className="relative pl-4 overflow-hidden h-full">
                <svg className="absolute top-0 left-[-11px] h-full w-8 pointer-events-none" viewBox="0 0 8 400" preserveAspectRatio="none">
                  <motion.line
                    x1="4" y1="0" x2="4" y2="400"
                    stroke="#ffffff" strokeOpacity="0.1" strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={timelineInView ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                </svg>
                <div className="space-y-6 mt-4">
                  {[
                    { title: "Live System Design", time: "Tomorrow, 2:00 PM", color: "#38bdf8" },
                    { title: "Assignment Due: Hooks", time: "Friday, 11:59 PM", color: "#f59e0b" },
                    { title: "React Mentorship", time: "Next Mon, 1:00 PM", color: "#7c6df0" },
                  ].map((act, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={timelineInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                      transition={{ delay: i * 0.2 + 0.3, duration: 0.5 }}
                      className="relative pl-6"
                    >
                      <span className="absolute left-[-5.5px] top-1.5 w-3 h-3 rounded-full border-[2px] border-[#0f1018] z-10" style={{ backgroundColor: act.color }} />
                      <div className="bg-[#161820]/60 p-3 rounded-xl border border-white/5 shadow-inner">
                        <p className="font-semibold text-sm mb-1">{act.title}</p>
                        <p className="text-xs text-white/50 flex items-center gap-1.5">
                          <Clock className="w-3 h-3" /> {act.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      </div>
    </div>
  );
}
