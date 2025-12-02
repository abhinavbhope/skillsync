'use client';
import { Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className }) => (
  <div className={`bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-6 ${className}`}>
    {children}
  </div>
);

export default function ContributionOpportunities({ project }) {
    if (!project) return null;

    const matchScore = project.matchScore || 85;

    return (
        <GlassCard className="h-full">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center"><Target className="mr-2"/>Contribution Opportunities</h3>
            
            <p className="text-sm text-gray-400 mb-4">Based on your skills: <span className="font-semibold text-gray-200">Java, JavaScript</span></p>

            <div className="flex flex-wrap gap-2 mb-6">
                {(project.contributionAreas || ['docs', 'samples', 'scripts']).map(area => (
                    <motion.div
                        key={area}
                        whileHover={{ scale: 1.05 }}
                    >
                         <Badge variant="secondary" className="bg-primary/20 text-primary-foreground border-primary/30 cursor-pointer">
                            {area}
                        </Badge>
                    </motion.div>
                ))}
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-gray-300">Match Score</span>
                    <span className="font-bold text-green-400">{matchScore}%</span>
                </div>
                <Progress value={matchScore} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-green-400 [&>div]:to-cyan-400"/>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-sm text-amber-300">
                    💡 "{project.matchReason || 'Matches your Java expertise and modular architecture preferences.'}"
                </p>
            </div>
        </GlassCard>
    );
}
