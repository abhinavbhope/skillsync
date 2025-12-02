'use client';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { 
  Loader2, 
  AlertTriangle, 
  Inbox, 
  Boxes, 
  Layers, 
  Target, 
  Star, 
  ChevronLeft,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import FloatingElements from '@/components/dashboard/FloatingElements';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import ProjectCard from '@/components/dashboard/opensource/ProjectCard';
import ProjectStatsHeader from '@/components/dashboard/opensource/ProjectStatsHeader';
import ProjectComparisonChart from '@/components/dashboard/opensource/ProjectComparisonChart';
import DirectoryExplorer from '@/components/dashboard/opensource/DirectoryExplorer';
import ArchitectureAnalysis from '@/components/dashboard/opensource/ArchitectureAnalysis';
import ContributionOpportunities from '@/components/dashboard/opensource/ContributionOpportunities';
import LanguageDistribution from '@/components/dashboard/opensource/LanguageDistribution';

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const GlassCard = ({ children, className }) => (
  <div className={`bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-6 ${className}`}>
    {children}
  </div>
);

export default function OpenSourceDashboard() {
  const { state } = useSidebar();
  const { data, error, isLoading, mutate } = useSWR('/api/opensource/saved', fetcher);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showStructure, setShowStructure] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // FIX: Use useEffect to set initial selected project
  useEffect(() => {
    if (data?.recommendations?.length > 0 && !selectedProject) {
      setSelectedProject(data.recommendations[0]);
    }
  }, [data, selectedProject]);

  const handleShowStructure = (project) => {
    setSelectedProject(project);
    setShowStructure(true);
  };

  const handleBackToProjects = () => {
    setShowStructure(false);
  };

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      // Use direct fetch since the API function might not be exported
      const response = await fetch('/api/opensource/recommendations', {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete recommendations');
      }
      
      // Refresh the data
      await mutate();
      
      // Reset states
      setSelectedProject(null);
      setShowStructure(false);
    } catch (error) {
      console.error('Failed to delete recommendations:', error);
      setDeleteError(error.message || 'Failed to delete recommendations. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="w-full">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-headline font-bold text-white flex items-center gap-3">
              <Boxes className="w-8 h-8 text-primary" />
              Open Source Recommendations
            </h1>
            <p className="mt-2 text-lg text-gray-400">
              AI-powered analysis of your saved project recommendations.
            </p>
          </header>
          
          <div className="flex justify-center items-center h-96">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="w-full">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-headline font-bold text-white flex items-center gap-3">
              <Boxes className="w-8 h-8 text-primary" />
              Open Source Recommendations
            </h1>
            <p className="mt-2 text-lg text-gray-400">
              AI-powered analysis of your saved project recommendations.
            </p>
          </header>
          
          <div className="flex flex-col items-center justify-center h-96 text-destructive">
            <AlertTriangle className="w-12 h-12 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Failed to Load Recommendations</h2>
            <p className="text-center max-w-md mb-4">{error.message}</p>
            <Button 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      );
    }
    
    if (!data?.recommendations || data.recommendations.length === 0) {
      return (
        <div className="w-full">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-headline font-bold text-white flex items-center gap-3">
              <Boxes className="w-8 h-8 text-primary" />
              Open Source Recommendations
            </h1>
            <p className="mt-2 text-lg text-gray-400">
              AI-powered analysis of your saved project recommendations.
            </p>
          </header>
          
          <div className="flex flex-col items-center justify-center h-96 text-gray-500">
            <Inbox className="w-16 h-16 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Saved Projects</h2>
            <p>You haven't saved any open source project recommendations yet.</p>
          </div>
        </div>
      );
    }

    // If showing structure view
    if (showStructure && selectedProject) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 w-full"
        >
          {/* Back Button and Header */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBackToProjects}
              className="flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Projects
            </Button>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-white">{selectedProject.projectName}</h2>
              <p className="text-gray-400 text-sm">by {selectedProject.owner}</p>
            </div>
          </div>

          {/* Project Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{selectedProject.stars?.toLocaleString() || 0}</div>
              <div className="text-sm text-gray-400">Stars</div>
            </div>
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{selectedProject.forks?.toLocaleString() || 0}</div>
              <div className="text-sm text-gray-400">Forks</div>
            </div>
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{selectedProject.openIssues?.toLocaleString() || 0}</div>
              <div className="text-sm text-gray-400">Issues</div>
            </div>
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-white">{selectedProject.primaryLanguage || 'N/A'}</div>
              <div className="text-sm text-gray-400">Language</div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Directory Structure - Takes 2/3 width */}
            <div className="lg:col-span-2">
              <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full">
                <h3 className="text-xl font-semibold text-white mb-4">Project Directory Structure</h3>
                <div className="h-[600px]">
                  <DirectoryExplorer project={selectedProject} />
                </div>
              </div>
            </div>

            {/* Side Panel - Takes 1/3 width */}
            <div className="space-y-6">
              {/* Architecture Analysis */}
              <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Architecture Analysis</h3>
                <ArchitectureAnalysis project={selectedProject} />
              </div>

              {/* Contribution Opportunities */}
              <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Contribution Opportunities</h3>
                <ContributionOpportunities project={selectedProject} />
              </div>

              {/* Quick Links */}
              <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => window.open(selectedProject.projectUrl, '_blank')}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    Open on GitHub
                  </Button>
                  <Button
                    onClick={handleBackToProjects}
                    variant="outline"
                    className="w-full border-white/10 hover:bg-white/10"
                  >
                    View All Projects
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    // Main projects view
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 w-full"
      >
        {/* Header Section with Delete Button */}
        <motion.div variants={itemVariants}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <header>
              <h1 className="text-3xl md:text-4xl font-headline font-bold text-white flex items-center gap-3">
                <Boxes className="w-8 h-8 text-primary" />
                Open Source Recommendations
              </h1>
              <p className="mt-2 text-lg text-gray-400">
                In-depth overview of projects that perfectly match your development vibe
              </p>
            </header>
            
            {/* Delete All Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/30"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  {isDeleting ? 'Deleting...' : 'Delete All'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-900 border-gray-700">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    Delete All Recommendations
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-300">
                    This action cannot be undone. This will permanently delete all {data.recommendations.length} saved project recommendations from your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                
                {deleteError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md">
                    <p className="text-sm text-red-300">{deleteError}</p>
                  </div>
                )}
                
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-gray-600 hover:bg-gray-800">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAll}
                    className="bg-red-600 hover:bg-red-700 text-white"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete All'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </motion.div>

        {/* User Profile Summary */}
        {data.userProfile && (
          <motion.div variants={itemVariants}>
            <GlassCard className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Your Developer Profile</h3>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="text-gray-300">Skill Level: <span className="font-semibold text-white">{data.userProfile.skillLevel}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-purple-400" />
                        <span className="text-gray-300">Primary Domains: <span className="font-semibold text-white">{data.userProfile.primaryDomains?.join(', ')}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-300">Architecture Patterns: <span className="font-semibold text-white">{data.userProfile.architecturePatterns?.length || 0}</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{data.recommendations.length}</div>
                      <div className="text-sm text-gray-400">Total Projects</div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Overall Stats */}
        <motion.div variants={itemVariants}>
          <ProjectStatsHeader recommendations={data.recommendations} />
        </motion.div>

        {/* Projects Grid */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recommended Projects</h2>
            <span className="text-sm text-gray-400 px-3 py-1 bg-white/5 rounded-full">
              {data.recommendations.length} projects
            </span>
          </div>
          <div className="space-y-6">
            {data.recommendations.map((project, index) => (
              <motion.div
                key={project.projectName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProjectCard
                  project={project}
                  onShowStructure={handleShowStructure}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Comparison and Analysis */}
        <motion.div variants={itemVariants}>
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Projects Comparison</h3>
            <ProjectComparisonChart recommendations={data.recommendations} />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <LanguageDistribution recommendations={data.recommendations} />
        </motion.div>
      </motion.div>
    );
  };
  
return (
  <div
    className={cn(
      "relative flex flex-col w-full min-h-screen transition-all duration-300 overflow-hidden",
      "pt-8 md:pt-16 pb-20 px-4 sm:px-6 lg:px-8",
      state === "expanded" ? "md:pl-64" : "md:pl-20"
    )}
  >
    {/* Background Layer 1: Gradient */}
    <div className="absolute inset-0 -z-30 bg-gradient-to-br from-[#0f0f0f] to-[#121826]" />

    {/* Background Layer 2: Floating Elements */}
    <div className="absolute inset-0 -z-20 opacity-40">
      <FloatingElements />
    </div>

    {/* Content Layer */}
    <div className="relative z-10 w-full">
      {renderContent()}
    </div>
  </div>
);



}