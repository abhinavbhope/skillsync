'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderOpen, 
  ExternalLink, 
  Star, 
  GitFork, 
  AlertCircle,
  Users,
  Code,
  Layers,
  FileText,
  Target,
  Calendar,
  ChevronDown,
  ChevronUp,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const GlassCard = ({ children, className }) => (
  <div className={`bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-6 ${className}`}>
    {children}
  </div>
);

export default function ProjectCard({ project, onShowStructure }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!project) return null;

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <GlassCard className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{project.projectName}</h3>
                <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{project.owner}</span>
                </p>
              </div>
            </div>
            
            <p className="text-gray-300 mt-4 line-clamp-2">{project.description}</p>
          </div>
          
          {/* Stats */}
          <div className="flex gap-4">
            <div className="text-center">
              <div className="flex items-center gap-1 text-2xl font-bold text-white">
                <Star className="w-5 h-5 text-yellow-400" />
                {project.stars?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-gray-400">Stars</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-2xl font-bold text-white">
                <GitFork className="w-5 h-5 text-green-400" />
                {project.forks?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-gray-400">Forks</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-2xl font-bold text-white">
                <AlertCircle className="w-5 h-5 text-red-400" />
                {project.openIssues?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-gray-400">Issues</div>
            </div>
          </div>
        </div>

        {/* Quick Info Row */}
        <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-white/10">
          <Badge variant="outline" className="bg-primary/10 text-primary-foreground border-primary/30">
            <Globe className="w-3 h-3 mr-2" />
            {project.primaryLanguage || 'N/A'}
          </Badge>
          
          <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30">
            <Layers className="w-3 h-3 mr-2" />
            {project.architectureAI || project.primaryArchitecture || 'N/A'}
          </Badge>
          
          {project.hasContributionGuidelines && (
            <Badge variant="outline" className="bg-green-500/10 text-green-300 border-green-500/30">
              <FileText className="w-3 h-3 mr-2" />
              Contribution Guidelines
            </Badge>
          )}
          
          <Badge variant="outline" className="bg-gray-500/10 text-gray-300 border-gray-500/30">
            <Calendar className="w-3 h-3 mr-2" />
            Updated {new Date(project.lastUpdated).toLocaleDateString()}
          </Badge>
        </div>

        {/* Match Reason */}
        <div className="mb-6 p-4 bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-300 mb-1">Why This Matches Your Vibe</h4>
              <p className="text-sm text-amber-200/90">{project.matchReason || 'Perfect match based on your technical expertise and architecture preferences.'}</p>
            </div>
          </div>
        </div>

        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-6">
                {/* Key Components */}
                {(project.keyComponents || project.keyComponentsAI || []).length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-300 mb-3">Key Components</h4>
                    <div className="flex flex-wrap gap-2">
                      {(project.keyComponents || project.keyComponentsAI || []).map(comp => (
                        <span
                          key={comp}
                          className="px-3 py-1.5 bg-black/40 text-gray-300 text-sm rounded-lg border border-white/10"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contribution Areas */}
                {project.contributionAreas && project.contributionAreas.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-300 mb-3">Recommended Contribution Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.contributionAreas.map(area => (
                        <Badge
                          key={area}
                          variant="secondary"
                          className="bg-secondary/20 text-secondary-foreground border-secondary/30"
                        >
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Topics */}
                {project.topics && project.topics.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-300 mb-3">Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.topics.map(topic => (
                        <span
                          key={topic}
                          className="px-3 py-1 bg-gray-800/50 text-gray-300 text-sm rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Issues */}
                {project.recentIssues && project.recentIssues.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-300 mb-3">Recent Issues</h4>
                    <div className="space-y-2">
                      {project.recentIssues.slice(0, 3).map((issue, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-black/30 border border-white/10 rounded-lg"
                        >
                          <div className="text-sm text-white font-medium">{issue.title}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            #{issue.number} • Opened {new Date(issue.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Readme Summary */}
                {project.readmeSummary && (
                  <div>
                    <h4 className="font-semibold text-gray-300 mb-3">Project Overview</h4>
                    <div className="p-4 bg-black/30 border border-white/10 rounded-lg">
                      <p className="text-gray-300 text-sm leading-relaxed">{project.readmeSummary}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-white/10">
          <Button
            variant="outline"
            className="flex-1 bg-black/30 border-white/10 hover:bg-white/10 hover:text-white"
            onClick={toggleExpand}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                Show Less Details
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                Show More Details
              </>
            )}
          </Button>
          
          <Button
            variant="default"
            className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            onClick={() => window.open(project.projectUrl, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View on GitHub
          </Button>
          
          <Button
            variant="outline"
            className="flex-1 bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20"
            onClick={() => onShowStructure(project)}
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            Show Structure
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}