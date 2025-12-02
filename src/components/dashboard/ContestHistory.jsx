'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useMemo } from 'react';
import { format } from 'date-fns';

const GlassmorphicCard = ({ children, className }) => (
    <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg ${className}`}>
        {children}
    </div>
);


const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/60 backdrop-blur-md p-2 border border-white/20 rounded-md text-sm text-white">
                <p className="label font-bold">{`Contest: ${payload[0].payload.name}`}</p>
                <p className="label">{`Date: ${label}`}</p>
                <p className="intro text-cyan-400">{`Rating: ${payload[0].value}`}</p>
                <p className="intro text-purple-400">{`Rank: ${payload[1].value}`}</p>
            </div>
        );
    }
    return null;
};

const ContestHistory = ({ data }) => {
    const chartData = useMemo(() => {
        if (!data) return [];
        return data.map(item => ({
            date: format(new Date(item.contestTime), 'MMM d'),
            rating: item.rating,
            rank: item.rank,
            name: item.contestName
        })).reverse(); // reverse to show chronological order
    }, [data]);
    
    if(!data || data.length === 0) return (
         <GlassmorphicCard>
            <CardHeader>
                <CardTitle>Contest History</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-64">
                <p className="text-gray-400">No contest history available.</p>
            </CardContent>
        </GlassmorphicCard>
    );

    return (
        <GlassmorphicCard>
            <CardHeader>
                <CardTitle>Contest Rating History</CardTitle>
                <CardDescription>Your performance over recent contests.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                        <YAxis yAxisId="left" stroke="#00eeff" fontSize={12} />
                        <YAxis yAxisId="right" orientation="right" stroke="#a855f7" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{fontSize: "12px"}}/>
                        <Line yAxisId="left" type="monotone" dataKey="rating" stroke="#00eeff" strokeWidth={2} dot={{r: 4}} activeDot={{ r: 8 }} />
                        <Line yAxisId="right" type="monotone" dataKey="rank" stroke="#a855f7" strokeDasharray="5 5" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </GlassmorphicCard>
    );
};

export default ContestHistory;
