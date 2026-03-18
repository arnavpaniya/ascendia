"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { StaggerList } from "@/components/ui/StaggerList";

function ToggleSwitch({ isOn, onToggle }: { isOn: boolean; onToggle: () => void }) {
  return (
    <div 
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${isOn ? 'bg-[#6c63ff]' : 'bg-white/20'}`}
      onClick={onToggle}
    >
      <motion.div 
        layout
        className="bg-white w-4 h-4 rounded-full shadow-md"
        animate={{ x: isOn ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
      />
    </div>
  );
}

const settingsSections = [
  {
    title: "Account",
    items: [
      { label: "Profile Visibility", desc: "Show my profile to other students", type: 'toggle' },
      { label: "Two-Factor Auth", desc: "Secure your account with 2FA", type: 'toggle' },
    ]
  },
  {
    title: "Notifications",
    items: [
      { label: "Push Notifications", desc: "Receive alerts on your browser", type: 'toggle' },
      { label: "Email Updates", desc: "Weekly progress reports", type: 'toggle' },
    ]
  },
  {
    title: "Appearance",
    items: [
      { label: "High Contrast Mode", desc: "Increase readability", type: 'toggle' },
      { label: "Reduce Animations", desc: "Disable 3D and heavy motion", type: 'toggle' },
    ]
  }
];

export default function SettingsPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    "Profile Visibility": true,
    "Push Notifications": true,
    "Email Updates": false,
  });

  const handleToggle = (label: string) => {
    setToggles(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-12">
      <div>
        <h1 className="text-3xl font-syne font-bold mb-2 text-glow">Settings</h1>
        <p className="text-white/60">Customize your learning experience.</p>
      </div>

      <div className="space-y-10">
        {settingsSections.map((section, idx) => (
          <motion.section 
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, ease: "easeOut" }}
          >
            <h2 className="text-xl font-syne font-bold mb-4 border-b border-white/5 pb-2 text-[#38bdf8]">
              {section.title}
            </h2>
            <StaggerList className="space-y-4">
              {section.items.map((item) => (
                <GlowCard key={item.label} className="p-4 flex justify-between items-center bg-white/5">
                  <div className="pr-8">
                    <h3 className="font-semibold mb-1">{item.label}</h3>
                    <p className="text-sm text-white/50">{item.desc}</p>
                  </div>
                  <ToggleSwitch 
                    isOn={!!toggles[item.label]} 
                    onToggle={() => handleToggle(item.label)} 
                  />
                </GlowCard>
              ))}
            </StaggerList>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
