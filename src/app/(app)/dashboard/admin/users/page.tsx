"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { GlowCard } from "@/components/ui/GlowCard";
import { Loader2, Search, Shield, User, MoreVertical, Edit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminUsersManager() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const usersSnap = await getDocs(collection(db, 'users'));
      const enrollmentsSnap = await getDocs(collection(db, 'enrollments'));
      const enrolls = enrollmentsSnap.docs.map(d => d.data());
      
      const data = usersSnap.docs.map(d => {
         const user = d.data();
         user.id = d.id;
         user.enrollments = [{ count: enrolls.filter(e => e.user_id === user.id).length }];
         return user;
      });
      data.sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      return data;
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string, newRole: string }) => {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
    },
    onSuccess: () => refetch()
  });

  const filteredUsers = users?.filter((u: any) => {
    const matchesSearch = u.email.toLowerCase().includes(search.toLowerCase()) || u.full_name?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-syne font-bold tracking-tight mb-2 md:mb-0">User Directory</h1>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-[#161820] border border-white/10 rounded-full text-sm focus:ring-2 focus:ring-[#7c6df0] outline-none w-full md:w-64 transition-all"
            />
          </div>
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 bg-[#161820] border border-white/10 rounded-full text-sm outline-none appearance-none"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      <GlowCard className="p-0 overflow-hidden">
        {isLoading ? (
           <div className="p-16 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#7c6df0]" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#161820]/80 text-white/50 uppercase font-bold text-xs">
                <tr>
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Role Authorization</th>
                  <th className="px-6 py-4">Gamification</th>
                  <th className="px-6 py-4">Active Deployments</th>
                  <th className="px-6 py-4">Last Ping</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers?.map((user: any) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7c6df0] to-[#38bdf8] p-0.5 shrink-0">
                          <img src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}&backgroundColor=transparent`} className="w-full h-full rounded-full bg-[#0f1018] object-cover" alt="avatar"/>
                        </div>
                        <div>
                          <p className="font-semibold">{user.full_name || "Anonymous Member"}</p>
                          <p className="text-xs text-white/40">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={user.role} 
                        onChange={(e) => updateRoleMutation.mutate({ userId: user.id, newRole: e.target.value })}
                        disabled={updateRoleMutation.isPending}
                        className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg appearance-none cursor-pointer outline-none transition-colors border ${user.role === 'admin' ? 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20 hover:bg-[#f59e0b]/20' : 'bg-[#6c63ff]/10 text-[#7c6df0] border-[#6c63ff]/20 hover:bg-[#6c63ff]/20'}`}
                      >
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                       <p className="font-mono text-[#f59e0b] font-medium">{user.xp || 0} XP</p>
                       <p className="text-xs text-white/40">Level {user.level || 1}</p>
                    </td>
                    <td className="px-6 py-4 text-white/80 font-medium">
                      {user.enrollments[0]?.count || 0} Courses
                    </td>
                    <td className="px-6 py-4 text-white/50 text-xs">
                      {user.last_active ? formatDistanceToNow(new Date(user.last_active), { addSuffix: true }) : "Never"}
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredUsers?.length === 0 && (
               <div className="p-12 pl-6 text-white/40 font-medium w-full text-center">No structural user nodes found mapping those constraints.</div>
            )}
          </div>
        )}
      </GlowCard>
    </div>
  );
}
