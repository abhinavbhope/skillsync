'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';

const GlassmorphicCard = ({ children, className }) => (
    <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg ${className}`}>
        {children}
    </div>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/60 backdrop-blur-md p-2 border border-white/20 rounded-md text-sm text-white">
                <p className="label">{`${label}`}</p>
                <p className="intro">{`Commits: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};


const CommitActivityChart = ({ data }) => {
    const chartData = useMemo(() => {
        if (!data) return [];
        // Show last 15 days for cleaner UI
        return data.slice(-15).map(item => ({
            date: format(parseISO(item.date), 'MMM d'),
            commits: item.commitCount,
        }));
    }, [data]);


    if(!data || data.length === 0) return null;

    return (
        <GlassmorphicCard>
            <CardHeader>
                <CardTitle>Commit Activity (Last 15 Days)</CardTitle>
                <CardDescription>Your contribution frequency.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 238, 255, 0.1)' }}/>
                        <Legend wrapperStyle={{fontSize: "12px"}}/>
                        <Bar dataKey="commits" fill="#00eeff" name="Commits" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </GlassmorphicCard>
    );
};

export default CommitActivityChart;
