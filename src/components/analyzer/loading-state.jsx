'use client';

import { motion } from 'framer-motion';
import { Github, Code } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

const LoadingState = () => {
    const [progress, setProgress] = useState({ github: 10, leetcode: 10 });

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => ({
                github: Math.min(prev.github + Math.random() * 20, 100),
                leetcode: Math.min(prev.leetcode + Math.random() * 20, 100)
            }));
        }, 500);

        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full mt-12"
        >
            <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold tracking-tight animate-pulse">Scanning Profiles...</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                {/* GitHub Skeleton */}
                <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Github className="w-5 h-5"/>
                            <h3 className="font-semibold">GitHub Analysis</h3>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Progress value={progress.github} className="w-full h-2 bg-primary/20" />
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <Skeleton className="h-16 rounded-lg" />
                            <Skeleton className="h-16 rounded-lg" />
                            <Skeleton className="h-16 rounded-lg" />
                            <Skeleton className="h-16 rounded-lg" />
                        </div>
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-24 w-full" />
                    </CardContent>
                </Card>

                {/* LeetCode Skeleton */}
                <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Code className="w-5 h-5"/>
                            <h3 className="font-semibold">LeetCode Analysis</h3>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Progress value={progress.leetcode} className="w-full h-2 bg-primary/20" />
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <Skeleton className="h-16 rounded-lg" />
                            <Skeleton className="h-16 rounded-lg" />
                        </div>
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
};

export default LoadingState;
