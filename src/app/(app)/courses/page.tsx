"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StaggerList } from "@/components/ui/StaggerList";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const filters = ["All", "In Progress", "Completed", "Recommended"];

export default function CoursesPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [isSearching, setIsSearching] = useState(false);
  const [loadedCourses, setLoadedCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      
      const { data: cData } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
      
      let pData: any[] = [];
      if (authData?.user) {
        const { data } = await supabase.from('course_progress').select('*').eq('user_id', authData.user.id);
        if (data) pData = data;
      }
      const completedIds = new Set(pData.filter(p => p.completed).map(p => p.course_id));

      if (cData && cData.length > 0) {
        const formatted = cData.map((c, idx) => ({
            id: c.id,
            title: c.title,
            instructor: "Platform Expert",
            progress: completedIds.has(c.id) ? 100 : 0,
            image: `https://images.unsplash.com/photo-${1611974789855 + idx}?w=500&q=80`
        }));
        setLoadedCourses(formatted);
      }
      setLoading(false);
    };
    fetchCourses();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-syne font-bold mb-2 text-glow">Courses</h1>
          <p className="text-white/60">Continue where you left off or discover new topics.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <motion.div 
            animate={{ width: isSearching ? 240 : 160 }}
            className="relative flex items-center bg-white/5 border border-white/10 rounded-full px-4 overflow-hidden focus-within:border-[#6c63ff] transition-colors"
          >
            <Search className="w-4 h-4 text-white/50" />
            <input 
              className="bg-transparent border-none outline-none text-sm px-3 py-2 w-full placeholder:text-white/30"
              placeholder="Search..."
              onFocus={() => setIsSearching(true)}
              onBlur={() => setIsSearching(false)}
            />
          </motion.div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className="relative px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap"
          >
            {activeFilter === filter && (
              <motion.div
                layoutId="courseFilter"
                className="absolute inset-0 bg-white text-[#0f172a] rounded-full z-0"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className={`relative z-10 ${activeFilter === filter ? "text-[#080b12]" : "text-white/60 hover:text-white"}`}>
              {filter}
            </span>
          </button>
        ))}
      </div>

      <StaggerList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loadedCourses.map((course) => (
          <Link href={`/courses/${course.id}`} key={course.id} className="block w-full focus:outline-none">
            <TiltCard className="cursor-pointer h-full transition-all hover:ring-2 hover:ring-[#6c63ff]/50">
              <div className="h-48 relative rounded-t-2xl overflow-hidden bg-[#1e293b]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#6c63ff]/20 to-[#f59e0b]/20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />
                <img src={course.image} alt="Instructor" className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-40" />
                <div className="absolute bottom-4 left-4 right-4">
                  <ProgressBar progress={course.progress} />
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                <p className="text-sm text-white/50">{course.instructor}</p>
              </div>
            </TiltCard>
          </Link>
        ))}
        {loadedCourses.length === 0 && !loading && (
           <div className="col-span-full border border-dashed border-white/10 rounded-3xl p-12 text-center text-white/50 bg-white/5">
             No active curriculum available right now!
           </div>
        )}
      </StaggerList>
    </div>
  );
}
