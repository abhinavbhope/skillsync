'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, TrendingUp, Target } from 'lucide-react';

const GlassmorphicCard = ({ children, className }) => (
    <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg ${className}`}>
        {children}
    </div>
);

const ImprovementPlan = ({ plan }) => {
    if (!plan) return null;

    const { immediateActions, longTermGoals } = plan;

    return (
        <GlassmorphicCard className="p-6">
            <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl font-bold font-headline text-white">Improvement Plan</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
                 <div>
                    <h3 className="text-lg font-semibold text-cyan-300 mb-3 flex items-center"><Zap className="w-5 h-5 mr-2" />Immediate Actions</h3>
                    <ul className="space-y-3">
                        {immediateActions.slice(0, 3).map((action, index) => (
                             <motion.li key={index} className="bg-black/20 p-3 rounded-lg border border-white/10 text-sm"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <p className="font-semibold text-gray-200">{action.title.replace('Improve ', '')}</p>
                                <p className="text-xs text-gray-400 mt-1">{action.description}</p>
                                <div className="flex justify-between items-center mt-2 text-xs">
                                     <span className={`font-bold ${action.priority === 'HIGH' ? 'text-rose-400' : 'text-amber-400'}`}>{action.priority}</span>
                                     <span className="text-gray-500">{action.estimatedTime}</span>
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center"><TrendingUp className="w-5 h-5 mr-2" />Long-Term Goals</h3>
                     <ul className="space-y-2">
                        {longTermGoals.slice(0, 2).map((goal, index) => (
                             <motion.li key={index} className="flex items-center text-gray-300"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                            >
                                <Target className="w-4 h-4 mr-3 text-purple-400 shrink-0" />
                                <div>
                                    <p className="font-medium">{goal.title}</p>
                                    <p className="text-xs text-gray-500">{goal.description}</p>
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </GlassmorphicCard>
    );
};

export default ImprovementPlan;
