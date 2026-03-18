"use client";

import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { TiltCard } from "@/components/ui/TiltCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { StaggerList } from "@/components/ui/StaggerList";
import { useIntersectionReveal } from "@/hooks/useIntersectionReveal";
import { BookOpen, Target, Clock, Zap } from "lucide-react";
import { OrbField } from "@/components/three/OrbField";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";

const activities = [
  { title: "Earned 'Fast Learner' Badge", time: "5 hours ago" },
  { title: "Started Platform Exploration", time: "1 day ago" },
];

export default function StudentDashboard() {
  const { ref: chartRef, isInView: chartInView } = useIntersectionReveal();
  const { ref: timelineRef, isInView: timelineInView } = useIntersectionReveal();
  
  const [userName, setUserName] = useState("Scholar");
  const [totalCourses, setTotalCourses] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) return;
      
      const user = authData.user;
      setUserName("Valiant Scholar");

      const { data: cData } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
      const { data: pData } = await supabase.from('course_progress').select('*').eq('user_id', user.id);
      
      const total = cData?.length || 0;
      const completedIds = new Set(pData?.filter(p => p.completed).map(p => p.course_id));
      
      setTotalCourses(total);
      setCompletedCount(completedIds.size);

      if (cData) {
         setAvailableCourses(cData.map((c, i) => ({
            id: c.id,
            title: c.title,
            instructor: "Platform Expert",
            progress: completedIds.has(c.id) ? 100 : 0,
            image: `https://images.unsplash.com/photo-${1611974789855 + i}?w=500&q=80`
         })));
      }
    };
    fetchDashboardData();
  }, []);

  const progressPercent = totalCourses > 0 ? Math.round((completedCount / totalCourses) * 100) : 0;

  const stats = [
    { label: "Completion Rate", value: progressPercent, icon: Zap, color: "#f59e0b", suffix: "%" },
    { label: "Courses Conquered", value: completedCount, icon: BookOpen, color: "#6c63ff", suffix: "" },
    { label: "Study Hours", value: 124, icon: Clock, color: "#38bdf8", suffix: "" },
    { label: "Daily Streak", value: 14, icon: Target, color: "#ec4899", suffix: "" },
  ];

  return (
    <div className="relative min-h-screen">
      <OrbField />
      
      <div className="relative z-10 space-y-8 pb-12">
        {/* Header / XP Banner */}
        <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6c63ff]/20 to-transparent pointer-events-none" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div>
              <h1 className="text-3xl font-syne font-bold mb-2">Welcome back, {userName}</h1>
              <p className="text-white/60">Level 42 Scholar • Keep up the great momentum</p>
            </div>
            <div className="w-full md:w-1/3">
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span className="text-[#f59e0b]">Overall Progress</span>
                <span className="text-white/60"><AnimatedCounter to={progressPercent} />% mastery</span>
              </div>
              <ProgressBar progress={progressPercent} />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <StaggerList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, boxShadow: "0 10px 40px -10px rgba(255,255,255,0.1)" }}
              className="bg-[#0f172a]/60 backdrop-blur-lg border border-white/5 rounded-2xl p-6 relative overflow-hidden group"
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none mix-blend-screen"
                style={{ background: `radial-gradient(circle at 50% 0%, ${stat.color}, transparent 70%)` }}
              />
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-white/5 text-white">
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-white/60 text-sm mb-1">{stat.label}</span>
                <div className="text-3xl font-syne font-bold flex items-end gap-1">
                  <AnimatedCounter to={stat.value} />
                  {stat.suffix && <span className="text-xl pb-0.5">{stat.suffix}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </StaggerList>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-syne font-bold mb-4 flex items-center gap-2">
                Continue Learning
              </h2>
              <div className="flex overflow-x-auto pb-6 -mx-2 px-2 gap-6 snap-x">
                {availableCourses.map((course) => (
                  <Link href={`/courses/${course.id}`} key={course.id} className="block shrink-0 snap-center focus:outline-none">
                    <TiltCard className="min-w-[280px] sm:min-w-[320px] transition-all hover:ring-2 hover:ring-[#6c63ff]/50">
                      <div className="h-40 relative rounded-t-2xl overflow-hidden">
                        <img src={course.image} alt={course.title} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <ProgressBar progress={course.progress} />
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-lg mb-1 truncate">{course.title}</h3>
                        <p className="text-sm text-white/50">{course.instructor}</p>
                      </div>
                    </TiltCard>
                  </Link>
                ))}
                {availableCourses.length === 0 && (
                  <div className="w-full p-8 text-center text-white/50 border border-white/5 rounded-2xl bg-[#0f172a]/40 backdrop-blur-md">
                    No active courses found. Navigate to Courses via the sidebar to access the curriculum.
                  </div>
                )}
              </div>
            </section>

            {/* Configurable Mini Bar Chart */}
            <GlowCard>
              <h2 className="text-xl font-syne font-bold mb-6">Learning Activity</h2>
              <div ref={chartRef as any} className="h-48 flex items-end justify-between gap-2 px-2">
                {[40, 70, 45, 90, 65, 80, 50].map((val, i) => (
                  <div key={i} className="w-full flex justify-center group relative cursor-pointer">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={chartInView ? { scaleY: 1 } : { scaleY: 0 }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                      className="w-full max-w-12 bg-white/10 group-hover:bg-[#6c63ff] rounded-t-sm origin-bottom transition-colors"
                      style={{ height: `${val}%` }}
                    />
                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black px-2 py-1 rounded text-xs font-bold">
                      {val}m
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-xs text-white/50 px-2 font-medium">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </GlowCard>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            <GlowCard className="h-full min-h-[400px]">
              <h2 className="text-xl font-syne font-bold mb-6">Recent Activity</h2>
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
                <div className="space-y-8">
                  {activities.map((act, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={timelineInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                      transition={{ delay: i * 0.2 + 0.5, duration: 0.5 }}
                      className="relative pl-6"
                    >
                      <span className="absolute left-[-5.5px] top-1.5 w-3 h-3 rounded-full bg-[#6c63ff] border-[2px] border-[#0f172a]" />
                      <p className="font-semibold text-sm mb-1">{act.title}</p>
                      <p className="text-xs text-white/50">{act.time}</p>
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
