'use client';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GlassmorphicCard = ({ children, className }) => (
    <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg ${className}`}>
        {children}
    </div>
);

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/60 backdrop-blur-md p-2 border border-white/20 rounded-md text-sm text-white">
                <p className="label">{`${payload[0].payload.subject}: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};


const SkillRadar = ({ data }) => {
    if (!data) return null;

    const chartData = data.skillCategories.map((category, index) => ({
        subject: category.replace(' ', '\n'), // Add line breaks for long labels
        score: data.skillScores[index],
        fullMark: 100,
    }));

    return (
        <GlassmorphicCard>
            <CardHeader>
                <CardTitle>Skill Assessment</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid strokeOpacity={0.3} />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#d1d5db', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="Score" dataKey="score" stroke="#00eeff" fill="#00eeff" fillOpacity={0.6} />
                        <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                </ResponsiveContainer>
            </CardContent>
        </GlassmorphicCard>
    );
};

export default SkillRadar;
