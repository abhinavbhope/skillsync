'use client';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

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

const PentagonalGraph = ({ leetcodeData }) => {
    // Calculate scores from real data instead of hardcoding
    const calculateScores = (data) => {
        if (!data) return []; // Fallback if no data
        
        const { problemStats, beatStats, contestSummary, activityData } = data;
        
        return [
            { 
                subject: 'Problem Solving', 
                score: Math.min(100, Math.round((problemStats.totalSolved / 500) * 100)),
                fullMark: 100 
            },
            { 
                subject: 'Algorithms', 
                score: Math.min(100, Math.round((problemStats.mediumSolved / 150) * 100)),
                fullMark: 100 
            },
            { 
                subject: 'Data Structures', 
                score: Math.min(100, Math.round((problemStats.totalSolved / 400) * 100)),
                fullMark: 100 
            },
            { 
                subject: 'Contest Perf.', 
                score: contestSummary?.attendedContestsCount > 0 ? 65 : 30,
                fullMark: 100 
            },
            { 
                subject: 'Consistency', 
                score: Math.min(100, Math.round((activityData.streak / 365) * 100)),
                fullMark: 100 
            },
        ];
    };

    const radarData = leetcodeData ? calculateScores(leetcodeData) : [
        // Fallback data (you could remove this once API is connected)
        { subject: 'Problem Solving', score: 0, fullMark: 100 },
        { subject: 'Algorithms', score: 0, fullMark: 100 },
        { subject: 'Data Structures', score: 0, fullMark: 100 },
        { subject: 'Contest Perf.', score: 0, fullMark: 100 },
        { subject: 'Consistency', score: 0, fullMark: 100 },
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <defs>
                    <radialGradient id="radarGradient">
                        <stop offset="0%" stopColor="rgba(0, 238, 255, 0.4)" />
                        <stop offset="100%" stopColor="rgba(0, 238, 255, 0.1)" />
                    </radialGradient>
                </defs>
                <PolarGrid strokeOpacity={0.3} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#d1d5db', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar 
                    name="Score" 
                    dataKey="score" 
                    stroke="#00eeff" 
                    fill="url(#radarGradient)" 
                    fillOpacity={0.8}
                    strokeWidth={2}
                />
                <Tooltip content={<CustomTooltip />} />
            </RadarChart>
        </ResponsiveContainer>
    );
};

export default PentagonalGraph;