'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import AnimatedCounter from "@/components/ui/animated-counter";
import { Trophy, Flame, Code } from "lucide-react";

const GlassmorphicCard = ({ children, className }) => (
    <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg ${className}`}>
        {children}
    </div>
);


const LeetcodeStats = ({ problemStats, beatStats, ranking }) => {
    if (!problemStats || !beatStats) return null;

    const { easySolved, mediumSolved, hardSolved, totalSolved } = problemStats;

    const getBeatStat = (difficulty) => {
        const stat = beatStats.find(s => s.difficulty === difficulty);
        return stat ? stat.percentage : 0;
    };

    return (
        <GlassmorphicCard className="p-6">
            <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl font-bold font-headline text-white flex items-center"><Code className="mr-2"/>LeetCode Stats</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Problem Breakdown */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-300">Problems Solved</h4>
                        <div className="flex items-center justify-between">
                            <span className="text-green-400">Easy</span>
                            <span className="font-mono text-white">{easySolved}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-amber-400">Medium</span>
                            <span className="font-mono text-white">{mediumSolved}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-rose-400">Hard</span>
                            <span className="font-mono text-white">{hardSolved}</span>
                        </div>
                        <div className="flex items-center justify-between font-bold border-t border-white/10 pt-2">
                            <span className="text-white">Total</span>
                            <span className="font-mono text-white">{totalSolved}</span>
                        </div>
                    </div>

                    {/* Beat Percentages */}
                    <div className="space-y-4">
                         <h4 className="font-semibold text-gray-300">Performance vs. Others</h4>
                        <div>
                            <div className="flex justify-between text-xs text-green-400 mb-1"><span>Easy</span><span>{getBeatStat('Easy')}%</span></div>
                            <Progress value={getBeatStat('Easy')} className="h-2 [&>div]:bg-green-400" />
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-amber-400 mb-1"><span>Medium</span><span>{getBeatStat('Medium')}%</span></div>
                            <Progress value={getBeatStat('Medium')} className="h-2 [&>div]:bg-amber-400"/>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-rose-400 mb-1"><span>Hard</span><span>{getBeatStat('Hard')}%</span></div>
                            <Progress value={getBeatStat('Hard')} className="h-2 [&>div]:bg-rose-400"/>
                        </div>
                    </div>
                    
                    {/* Ranking */}
                    <div className="text-center flex flex-col items-center justify-center bg-black/20 p-4 rounded-lg">
                        <Trophy className="w-10 h-10 text-amber-400 mb-2"/>
                        <h4 className="font-semibold text-gray-300">Global Rank</h4>
                        <p className="text-3xl font-bold font-mono text-white">
                            <AnimatedCounter to={ranking} />
                        </p>
                    </div>
                </div>
            </CardContent>
        </GlassmorphicCard>
    );
};

export default LeetcodeStats;
