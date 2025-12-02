'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedCounter from '@/components/ui/animated-counter';

const GlassmorphicCard = ({ children, className }) => (
    <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg ${className}`}>
        {children}
    </div>
);

const levelColorMap = {
    INTERMEDIATE: 'text-cyan-400',
    BEGINNER: 'text-green-400',
    ADVANCED: 'text-purple-400',
    EXPERT: 'text-amber-400',
};

const OverallScore = ({ score, level }) => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <GlassmorphicCard className="p-6 flex flex-col items-center justify-center">
            <CardHeader className="p-0 items-center">
                <CardTitle className="text-xl font-bold font-headline text-white">Overall Skill Score</CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-4 flex flex-col items-center">
                <div className="relative w-40 h-40">
                    <svg className="w-full h-full" viewBox="0 0 140 140">
                        <circle
                            className="text-black/10"
                            strokeWidth="10"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx="70"
                            cy="70"
                        />
                        <motion.circle
                            className="text-primary"
                            strokeWidth="10"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx="70"
                            cy="70"
                            transform="rotate(-90 70 70)"
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: offset }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-white">
                            <AnimatedCounter to={score.toFixed(0)} />
                        </span>
                    </div>
                </div>
                 <p className={`mt-4 text-lg font-semibold ${levelColorMap[level] || 'text-gray-400'}`}>{level}</p>
            </CardContent>
        </GlassmorphicCard>
    );
};

export default OverallScore;
