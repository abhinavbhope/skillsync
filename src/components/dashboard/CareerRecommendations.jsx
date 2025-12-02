'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Zap, ArrowRight } from 'lucide-react';

const GlassmorphicCard = ({ children, className }) => (
    <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg ${className}`}>
        {children}
    </div>
);

const CareerRecommendations = ({ recommendations }) => {
    if (!recommendations) return null;

    const { immediateActions, longTermGoals, learningPaths, recommendedTechnologies } = recommendations;

    return (
        <GlassmorphicCard className="p-6">
            <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl font-bold font-headline text-white">Career Trajectory</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Immediate Actions */}
                    <div>
                        <h3 className="text-lg font-semibold text-cyan-300 mb-3 flex items-center"><Zap className="w-5 h-5 mr-2" />Immediate Actions</h3>
                        <ul className="space-y-2">
                            {immediateActions.map((action, index) => (
                                <motion.li key={index} className="flex items-start text-gray-300"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <CheckCircle className="w-4 h-4 mr-2 mt-1 text-green-400 shrink-0" />
                                    <span>{action}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                    {/* Long Term Goals */}
                    <div>
                        <h3 className="text-lg font-semibold text-purple-300 mb-3">Long-Term Goals</h3>
                        <ul className="space-y-2">
                            {longTermGoals.map((goal, index) => (
                                <motion.li key={index} className="flex items-start text-gray-300"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                     <ArrowRight className="w-4 h-4 mr-2 mt-1 text-purple-400 shrink-0" />
                                    <span>{goal}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </div>

                 {/* Learning Paths */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-amber-300 mb-3">Recommended Learning Paths</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {learningPaths.map((path, index) => (
                            <motion.div 
                                key={index} 
                                className="bg-black/20 p-4 rounded-lg border border-white/10"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                            >
                                <h4 className="font-bold text-white">{path.topic}</h4>
                                <p className="text-sm text-gray-400">{path.targetOutcome}</p>
                                <p className="text-xs text-amber-400 mt-2">{path.timeline}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Recommended Technologies */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-300 mb-3">Technologies to Focus On</h3>
                     <div className="flex flex-wrap gap-2">
                        {recommendedTechnologies.map((tech, index) => (
                            <motion.div 
                                key={index} 
                                className="bg-cyan-400/10 text-cyan-300 text-xs font-medium px-3 py-1 rounded-full border border-cyan-400/30"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1 + index * 0.05 }}
                            >
                                {tech}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </GlassmorphicCard>
    );
};

export default CareerRecommendations;
