'use client';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Boxes, Star, GitFork, Target } from 'lucide-react';
import AnimatedCounter from '@/components/ui/animated-counter';

const GlassCard = ({ children, className }) => (
  <div className={`bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-6 ${className}`}>
    {children}
  </div>
);

const StatItem = ({ icon, value, label, color }) => (
    <div className={`text-center p-4 bg-black/20 rounded-xl border border-white/10`}>
        <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center bg-${color}-500/10 mb-2`}>
            {icon}
        </div>
        <div className="text-3xl font-bold text-white">
             {typeof value === 'number' && !isNaN(value) ? <AnimatedCounter to={value} /> : value}
        </div>
        <p className="text-sm text-gray-400">{label}</p>
    </div>
);

export default function ProjectStatsHeader({ recommendations, userProfile }) {

  const stats = useMemo(() => {
    if (!recommendations || recommendations.length === 0) {
      return { total: 0, avgStars: 0, avgForks: 0, avgMatch: 0, primaryLanguage: 'N/A', primaryArch: 'N/A' };
    }

    const total = recommendations.length;

    const totalStars = recommendations.reduce((sum, p) => sum + (p.stars || 0), 0);
    const totalForks = recommendations.reduce((sum, p) => sum + (p.forks || 0), 0);
    const totalMatch = recommendations.reduce((sum, p) => sum + (p.matchScore || 80), 0);

    // 🔥 FIXED: Primary language from backend techStack
    const primaryLanguage =
      userProfile?.techStack?.length > 0 ? userProfile.techStack[0] : "N/A";

    // Architecture detection (works fine)
    const archCounts = recommendations.reduce((acc, p) => {
        if(p.architectureAI) acc[p.architectureAI] = (acc[p.architectureAI] || 0) + 1;
        return acc;
    }, {});

    const primaryArch =
      Object.keys(archCounts).sort((a, b) => archCounts[b] - archCounts[a])[0] || "N/A";

    return {
      total,
      avgStars: Math.round(totalStars / total),
      avgForks: Math.round(totalForks / total),
      avgMatch: Math.round(totalMatch / total),
      primaryLanguage,
      primaryArch,
    };
  }, [recommendations, userProfile]);

  return (
    <GlassCard className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatItem icon={<Boxes className="w-6 h-6 text-primary" />} value={stats.total} label="Projects" color="indigo"/>
        <StatItem icon={<Star className="w-6 h-6 text-yellow-400" />} value={stats.avgStars} label="Avg Stars" color="yellow"/>
        <StatItem icon={<GitFork className="w-6 h-6 text-green-400" />} value={stats.avgForks} label="Avg Forks" color="green"/>
        <StatItem icon={<Target className="w-6 h-6 text-purple-400" />} value={`${stats.avgMatch}%`} label="Avg Match" color="purple"/>
      </div>

      <div className="text-center mt-6 pt-4 border-t border-white/10 text-sm text-gray-400">
        Primary Technology: <span className="font-semibold text-white">{stats.primaryLanguage}</span>
        {' • '}
        Common Architecture: <span className="font-semibold text-white">{stats.primaryArch}</span>
      </div>
    </GlassCard>
  );
}

