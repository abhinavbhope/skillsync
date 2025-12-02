'use client';

import { motion } from 'framer-motion';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';
import { useMemo } from 'react';

const GlassmorphicCard = ({ children, className }) => (
    <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg ${className}`}>
        {children}
    </div>
);

const KEYWORDS = [
    'mvc', 'component-based', 'microservices', 'monolithic',
    'tests', 'testing', 'no tests', 'lack of tests', 'unit', 'integration',
    'good', 'well-structured', 'organized', 'maintainability', 'reliability', 'decent',
    'poor', 'disorganized', 'unusual', 'confusing', 'drawback', 'concerning', 'negative',
    'docker', 'ci/cd', 'typescript', 'javascript', 'java', 'spring', 'jwt',
    'ai', 'gemini', 'architecture', 'component', 'modularization'
];


const GithubAnalysisReasoning = ({ reasoning }) => {
    if (!reasoning) return null;

    const highlightedReasoning = useMemo(() => {
        return reasoning.split(' ').map((word, wordIndex) => {
            const lowerWord = word.toLowerCase().replace(/[^a-z0-9-]/g, '');
            const isKeyword = KEYWORDS.includes(lowerWord);
            
            return (
                <span 
                    key={wordIndex}
                    className={isKeyword ? 'font-semibold text-cyan-300' : ''}
                >
                    {word}{' '}
                </span>
            );
        });
    }, [reasoning]);

    return (
        <GlassmorphicCard className="p-6">
            <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl font-bold font-headline text-white flex items-center">
                    <BrainCircuit className="w-6 h-6 mr-3 text-cyan-400" />
                    AI Reasoning Summary
                </CardTitle>
            </CardHeader>
            <motion.div 
                className="bg-black/20 p-4 rounded-lg border border-white/10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <p className="text-gray-300 text-sm leading-relaxed">
                    {highlightedReasoning}
                </p>
            </motion.div>
        </GlassmorphicCard>
    );
};

export default GithubAnalysisReasoning;
