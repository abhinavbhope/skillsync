'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

const GlassCard = ({ children, className }) => (
  <div className={`bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-6 ${className}`}>
    {children}
  </div>
);

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/60 p-3 rounded-lg border border-white/10 text-sm">
                <p className="font-bold text-white mb-1">{payload[0].payload.name}</p>
                <p className="text-yellow-400">{`Stars: ${payload.find(p => p.dataKey === 'stars')?.value || 0}`}</p>
                <p className="text-green-400">{`Forks: ${payload.find(p => p.dataKey === 'forks')?.value || 0}`}</p>
                <p className="text-red-400">{`Issues: ${payload.find(p => p.dataKey === 'openIssues')?.value || 0}`}</p>
            </div>
        );
    }
    return null;
};

export default function ProjectComparisonChart({ recommendations }) {
    const chartData = useMemo(() => {
        return recommendations.map(p => ({
            name: p.projectName.length > 15 ? `${p.projectName.substring(0, 15)}...` : p.projectName,
            stars: p.stars || 0,
            forks: p.forks || 0,
            openIssues: p.openIssues || 0,
        }));
    }, [recommendations]);

    return (
        <GlassCard className="h-full">
            <h3 className="text-xl font-semibold text-white mb-1">Project Comparison</h3>
            <p className="text-sm text-gray-400 mb-6">Hover over bars for detailed metrics.</p>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} layout="vertical" barSize={15}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                    <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} width={100} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Legend wrapperStyle={{fontSize: "12px"}}/>
                    <Bar dataKey="stars" fill="#facc15" name="Stars" />
                    <Bar dataKey="forks" fill="#4ade80" name="Forks" />
                    <Bar dataKey="openIssues" fill="#f87171" name="Issues" />
                </BarChart>
            </ResponsiveContainer>
        </GlassCard>
    );
}
