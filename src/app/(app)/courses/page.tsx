"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StaggerList } from "@/components/ui/StaggerList";

const filters = ["All", "In Progress", "Completed", "Recommended"];
const courses = [
  ...Array(8).fill(null).map((_, i) => ({
    id: i,
    title: `Advanced Module ${i + 1}`,
    instructor: "Dr. Exemplar",
    progress: Math.floor(Math.random() * 100),
    image: `https://images.unsplash.com/photo-${1500000000000 + i}?w=500&q=80`
  }))
];

export default function CoursesPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [isSearching, setIsSearching] = useState(false);
  const [loadedCourses, setLoadedCourses] = useState<any[]>(courses);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/courses`)
      .then(res => res.json())
      .then(data => {
         // Format the backend data to match our UI props if data exists
         if (data && data.length > 0) {
            const formatted = data.map((c: any) => ({
                id: c._id || c.title,
                title: c.title,
                instructor: c.createdBy || "Dr. Exemplar",
                progress: Math.floor(Math.random() * 100),
                image: c.videoUrl || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80`
            }));
            setLoadedCourses(formatted);
         }
      })
      .catch(err => console.error("Backend unreachable, using fallback UI courses", err));
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
          <TiltCard key={course.id} className="cursor-pointer">
            <div className="h-48 relative rounded-t-2xl overflow-hidden bg-[#1e293b]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#6c63ff]/20 to-[#f59e0b]/20 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full border-2 border-[#0f172a] overflow-hidden">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.id}`} alt="Instructor" className="w-full h-full bg-[#f8fafc]" />
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <ProgressBar progress={course.progress} />
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
              <p className="text-sm text-white/50">{course.instructor}</p>
            </div>
          </TiltCard>
        ))}
      </StaggerList>
    </div>
  );
}
