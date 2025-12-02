'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Gem } from 'lucide-react';
import { useMemo } from 'react';

const GlassCard = ({ children, className }) => (
  <div className={`bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-6 ${className}`}>
    {children}
  </div>
);

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f472b6'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/60 p-2 rounded-lg border border-white/10 text-sm text-white">
        {`${payload[0].name}: ${payload[0].value}%`}
      </div>
    );
  }
  return null;
};

export default function LanguageDistribution({ recommendations = [], userProfile = {} }) {
  
  const { languageData, primaryLanguage, topics } = useMemo(() => {
    // If no recommendations — show NOTHING
    if (!recommendations || recommendations.length === 0) {
      return { languageData: [], primaryLanguage: "N/A", topics: [] };
    }

    // ===============================
    // 1️⃣ Language distribution (from recommendations)
    // ===============================
    const langCounts = recommendations.reduce((acc, p) => {
      if (p.primaryLanguage) acc[p.primaryLanguage] = (acc[p.primaryLanguage] || 0) + 1;
      return acc;
    }, {});

    const total = recommendations.length;

    const languageData = Object.entries(langCounts).map(([name, count]) => ({
      name,
      value: parseFloat(((count / total) * 100).toFixed(2)),
    }));

    const primaryLanguage =
      Object.keys(langCounts).sort((a, b) => langCounts[b] - langCounts[a])[0] || "N/A";

    // ===============================
    // 2️⃣ Collect top topics
    // ===============================
    const allTopics = [...new Set(recommendations.flatMap((p) => p.topics || []))];

    return {
      languageData,
      primaryLanguage,
      topics: allTopics.slice(0, 5),
    };
  }, [recommendations]);

  return (
    <GlassCard>
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Gem className="mr-2" /> Technology Stack (Recommended Projects)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT SIDE INFO */}
        <div>
          <p className="text-sm text-gray-400">
            Primary Language:{" "}
            <span className="font-semibold text-white">{primaryLanguage}</span>
          </p>

          <p className="text-sm text-gray-400 mt-3">Common Topics:</p>

          <div className="flex flex-wrap gap-2 mt-2">
            {topics.map((topic) => (
              <span
                key={topic}
                className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded-md text-xs"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE PIE CHART */}
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={languageData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              labelLine={false}
              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {languageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", marginLeft: "20px" }} />
          </PieChart>
        </ResponsiveContainer>

      </div>
    </GlassCard>
  );
}
