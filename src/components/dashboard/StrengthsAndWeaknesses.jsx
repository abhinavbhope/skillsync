'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const GlassmorphicCard = ({ children, className }) => (
    <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg ${className}`}>
        {children}
    </div>
);

const StrengthsAndWeaknesses = ({ strengths, weaknesses }) => {
    return (
        <GlassmorphicCard className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold text-green-400 flex items-center mb-2"><ArrowUpCircle className="mr-2" />Key Strengths</h3>
                    <ul className="space-y-2">
                        {strengths?.slice(0,3).map((item, index) => (
                            <motion.li 
                                key={index} 
                                className="text-sm text-gray-300"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                {item}
                            </motion.li>
                        ))}
                    </ul>
                </div>
                <div>
                     <h3 className="font-semibold text-rose-400 flex items-center mb-2"><ArrowDownCircle className="mr-2" />Growth Areas</h3>
                    <ul className="space-y-2">
                        {weaknesses?.slice(0,3).map((item, index) => (
                            <motion.li 
                                key={index} 
                                className="text-sm text-gray-300"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                            >
                                {item}
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </div>
        </GlassmorphicCard>
    );
};

export default StrengthsAndWeaknesses;
