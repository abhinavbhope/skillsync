'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Layers } from 'lucide-react';
import { useMemo } from 'react';

const GlassCard = ({ children, className }) => (
  <div className={`bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-6 ${className}`}>
    {children}
  </div>
);

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/60 p-2 rounded-lg border border-white/10 text-sm text-white">
                {`${payload[0].name}: ${payload[0].value} projects`}
            </div>
        );
    }
    return null;
};

export default function ArchitectureAnalysis({ project }) {
    const architectureData = useMemo(() => {
        // This would typically be aggregated from all saved projects
        // For now, we simulate it based on the selected project
        const data = [
            { name: 'Component-Based', value: 4 },
            { name: 'Layered', value: 3 },
            { name: 'Microservices', value: 2 },
            { name: 'Monolithic', value: 1 },
        ];
        if (project && !data.find(d => d.name === project.architectureAI)) {
            data.push({ name: project.architectureAI, value: 1 });
        }
        return data;
    }, [project]);

    if (!project) return null;

    return (
        <GlassCard className="h-full">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center"><Layers className="mr-2"/>Architecture Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-300">Project Architecture</h4>
<p className="text-lg font-bold text-primary">
  {project.architectureAI || project.primaryArchitecture || 'N/A'}
</p>
                    
                    <h4 className="font-semibold text-gray-300 pt-2">Key Components</h4>
                    <ul className="space-y-1">
  {(project.keyComponents || project.keyComponentsAI || []).map(comp => (
    <li key={comp} className="text-sm text-gray-400 bg-black/20 px-3 py-1 rounded-md border border-white/5">
      • {comp}
    </li>
  ))}
</ul>
                </div>
                
                <div>
                     <h4 className="font-semibold text-gray-300 mb-2 text-center">Common Patterns</h4>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={architectureData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {architectureData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </GlassCard>
    );
}
