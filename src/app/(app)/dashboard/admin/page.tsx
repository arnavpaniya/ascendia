"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { GlowCard } from "@/components/ui/GlowCard";
import { Pill } from "@/components/ui/Pill";
import { StaggerList } from "@/components/ui/StaggerList";
import { Users, TrendingUp, Award, DollarSign } from "lucide-react";

// Dummy Data
const revenueData = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 5000 },
  { month: "Apr", revenue: 4500 },
  { month: "May", revenue: 6000 },
  { month: "Jun", revenue: 8000 },
];

const courseDist = [
  { name: "Science", value: 400, color: "#6c63ff" },
  { name: "Math", value: 300, color: "#38bdf8" },
  { name: "History", value: 300, color: "#f59e0b" },
  { name: "Arts", value: 200, color: "#ec4899" },
];

const students = [
  { name: "Alice Johnson", course: "Advanced Quantum Mechanics", status: "Active", progress: 85 },
  { name: "Bob Smith", course: "Neural Networks Engineering", status: "At Risk", progress: 24 },
  { name: "Charlie Davis", course: "Macroeconomics Principles", status: "Completed", progress: 100 },
  { name: "Diana Prince", course: "Advanced Quantum Mechanics", status: "Active", progress: 62 },
];

const alerts = [
  { title: "Server Load High", desc: "Database CPU at 94%", color: "border-red-500", iconbg: "bg-red-500/20" },
  { title: "New Course Ranked #1", desc: "Quantum Mechanics trending", color: "border-[#f59e0b]", iconbg: "bg-[#f59e0b]/20" },
  { title: "Payment Gateway", desc: "Stripe webhook failed", color: "border-red-500", iconbg: "bg-red-500/20" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-syne font-bold mb-2 text-glow">Admin Overview</h1>
          <p className="text-white/60">Platform-wide KPIs and metrics</p>
        </div>
      </div>

      {/* KPIs */}
      <StaggerList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", val: "$124,500", icon: DollarSign, color: "#6c63ff" },
          { label: "Active Users", val: "48,231", icon: Users, color: "#38bdf8" },
          { label: "Completion Rate", val: "68%", icon: Award, color: "#f59e0b" },
          { label: "Growth Trend", val: "+24%", icon: TrendingUp, color: "#10b981" },
        ].map((kpi, i) => (
          <GlowCard key={i} className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${kpi.color}20`, color: kpi.color }}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <span className="text-white/60 font-medium">{kpi.label}</span>
            </div>
            <div className="text-3xl font-syne font-bold">{kpi.val}</div>
          </GlowCard>
        ))}
      </StaggerList>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlowCard className="lg:col-span-2 p-6 flex flex-col">
          <h2 className="text-xl font-syne font-bold mb-6">Revenue Trend</h2>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6c63ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172ab0", backdropFilter: "blur(10px)", borderColor: "#ffffff10", borderRadius: "12px" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#6c63ff" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlowCard>

        <GlowCard className="p-6 flex flex-col">
          <h2 className="text-xl font-syne font-bold mb-6">Course Distribution</h2>
          <div className="flex-1 flex justify-center items-center min-h-[300px]">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={courseDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                  stroke="none"
                >
                  {courseDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172ab0", backdropFilter: "blur(10px)", borderColor: "#ffffff10", borderRadius: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {courseDist.map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                {c.name}
              </div>
            ))}
          </div>
        </GlowCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlowCard className="lg:col-span-2 p-6 overflow-hidden flex flex-col">
          <h2 className="text-xl font-syne font-bold mb-6">Recent Students</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-white/50 text-sm">
                  <th className="pb-3 font-medium cursor-pointer hover:text-white transition">Student Name ↑</th>
                  <th className="pb-3 font-medium cursor-pointer hover:text-white transition">Course</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Progress</th>
                </tr>
              </thead>
              <tbody>
                {students.map((stu, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="py-4 font-medium">{stu.name}</td>
                    <td className="py-4 text-white/70">{stu.course}</td>
                    <td className="py-4">
                      <Pill 
                        color={stu.status === "Completed" ? "highlight" : stu.status === "At Risk" ? "accent" : "primary"} 
                        pulse={stu.status === "At Risk"}
                      >
                        {stu.status}
                      </Pill>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <span className="text-sm font-medium">{stu.progress}%</span>
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${stu.progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-white/80 rounded-full" 
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlowCard>

        <GlowCard className="p-6">
          <h2 className="text-xl font-syne font-bold mb-6">System Alerts</h2>
          <div className="space-y-4">
            {alerts.map((alert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 25 }}
                className={`p-4 bg-card border border-white/5 border-l-4 rounded-xl flex gap-4 ${alert.color}`}
              >
                <div>
                  <h4 className="font-syne font-bold text-sm mb-1">{alert.title}</h4>
                  <p className="text-xs text-white/60">{alert.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlowCard>
      </div>

    </div>
  );
}
