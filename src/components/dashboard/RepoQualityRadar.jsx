'use client';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useMemo } from 'react';

const GlassmorphicCard = ({ children, className }) => (
    <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg ${className}`}>
        {children}
    </div>
);

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/60 backdrop-blur-md p-2 border border-white/20 rounded-md text-sm text-white">
                <p className="label font-bold">{payload[0].payload.name}</p>
                 {payload.map(p => (
                    <p key={p.dataKey} style={{color: p.color}}>{`${p.name}: ${p.value.toFixed(1)}`}</p>
                 ))}
            </div>
        );
    }
    return null;
};


const RepoQualityRadar = ({ data }) => {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];
        // Use top 5 repos for clarity
        return data.slice(0, 5).map(repo => ({
            name: repo.repoName,
            architecture: repo.architectureScore,
            testing: repo.testingSetupScore,
            quality: repo.qualityScore,
            fullMark: 100,
        }));
    }, [data]);
    
     if(!data || data.length === 0) return (
         <GlassmorphicCard>
            <CardHeader>
                <CardTitle>Repository Quality</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-64">
                <p className="text-gray-400">No repository data available for radar.</p>
            </CardContent>
        </GlassmorphicCard>
    );

    return (
        <GlassmorphicCard>
            <CardHeader>
                <CardTitle>Repository Quality Breakdown</CardTitle>
                <CardDescription>Scores for top repositories.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid strokeOpacity={0.3}/>
                        <PolarAngleAxis dataKey="name" fontSize={10} stroke="#e5e7eb" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} fontSize={10}/>
                        <Radar name="Architecture" dataKey="architecture" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        <Radar name="Testing" dataKey="testing" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                        <Radar name="Overall Quality" dataKey="quality" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                        <Tooltip content={<CustomTooltip />}/>
                        <Legend />
                    </RadarChart>
                </ResponsiveContainer>
            </CardContent>
        </GlassmorphicCard>
    );
};

export default RepoQualityRadar;
