'use client';

import { Suspense } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2, Rocket } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import FloatingElements from '@/components/dashboard/FloatingElements';
import UserHeader from '@/components/dashboard/UserHeader';
import PlatformStatus from '@/components/dashboard/PlatformStatus';
import StatCard from '@/components/dashboard/StatCard';
import LanguageDistributionChart from '@/components/dashboard/LanguageDistributionChart';
import CommitActivityChart from '@/components/dashboard/CommitActivityChart';
import RepoQualityRadar from '@/components/dashboard/RepoQualityRadar';
import LeetcodeStats from '@/components/dashboard/LeetcodeStats';
import ContestHistory from '@/components/dashboard/ContestHistory';
import SkillRadar from '@/components/dashboard/SkillRadar';
import ImprovementPlan from '@/components/dashboard/ImprovementPlan';
import OverallScore from '@/components/dashboard/OverallScore';
import StrengthsAndWeaknesses from '@/components/dashboard/StrengthsAndWeaknesses';
import CareerRecommendations from '@/components/dashboard/CareerRecommendations';
import TopRepositories from '@/components/dashboard/TopRepositories';
import GithubAnalysisReasoning from '@/components/dashboard/GithubAnalysisReasoning';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';

const fetcher = async (url) => {
  try {
    const res = await fetch(url);
    
    if (!res.ok) {
      // Try to parse error message from response
      let errorMessage = 'Failed to fetch data';
      
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If response is not JSON, use status text
        errorMessage = res.statusText || errorMessage;
      }
      
      const error = new Error(errorMessage);
      error.status = res.status;
      
      if (res.status === 404) {
        error.message = 'No analysis data found.';
      }
      
      throw error;
    }
    
    return res.json();
  } catch (error) {
    // Handle network errors or other fetch failures
    if (error.name === 'TypeError') {
      const networkError = new Error('Network error - failed to connect to server');
      networkError.status = 0;
      throw networkError;
    }
    throw error;
  }
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

function NoAnalysisCard() {
    const router = useRouter();
    
    return (
        <motion.div
            className="flex items-center justify-center min-h-[70vh] px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <motion.div
                className="relative bg-gradient-to-br from-card/80 to-card/40 border border-white/20 rounded-3xl p-8 sm:p-12 shadow-2xl max-w-4xl w-full backdrop-blur-xl overflow-hidden"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ 
                            duration: 4, 
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"
                        animate={{ 
                            scale: [1.2, 1, 1.2],
                            opacity: [0.4, 0.7, 0.4]
                        }}
                        transition={{ 
                            duration: 5, 
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                    />
                </div>

                {/* Floating Icons */}
                <motion.div
                    className="absolute top-6 right-6 text-primary/20"
                    animate={{ 
                        rotate: 360,
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity }
                    }}
                >
                    <Rocket className="w-12 h-12" />
                </motion.div>

                {/* Main Content */}
                <div className="relative z-10 text-center">
                    {/* Animated Icon */}
                    <motion.div
                        className="mx-auto w-24 h-24 mb-8 flex items-center justify-center bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-2xl"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                            duration: 0.8, 
                            type: "spring", 
                            stiffness: 100 
                        }}
                        whileHover={{ 
                            scale: 1.1, 
                            rotate: 5,
                            transition: { duration: 0.3 }
                        }}
                    >
                        <Rocket className="w-10 h-10 text-white" />
                    </motion.div>

                    {/* Title with Stagger Animation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <h2 className="text-4xl sm:text-5xl font-headline font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                            Ready for Your Code Journey?
                        </h2>
                    </motion.div>

                    {/* Description with Fade In */}
                    <motion.p
                        className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        Unlock powerful insights by connecting your GitHub and LeetCode profiles. 
                        Get AI-powered analysis of your coding skills, project quality, and career growth opportunities.
                    </motion.p>

                    {/* Feature Highlights */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                    >
                        {[
                            { icon: "🚀", text: "AI-Powered Insights" },
                            { icon: "📊", text: "Detailed Analytics" },
                            { icon: "🎯", text: "Career Recommendations" }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm"
                                whileHover={{ 
                                    scale: 1.05, 
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                    transition: { duration: 0.2 }
                                }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                            >
                                <div className="text-2xl mb-2">{feature.icon}</div>
                                <div className="text-sm text-gray-300">{feature.text}</div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.6 }}
                    >
                        <motion.button
                            className="group relative bg-gradient-to-r from-primary to-secondary text-white font-semibold text-lg px-12 py-4 rounded-2xl shadow-2xl overflow-hidden"
                            whileHover={{ 
                                scale: 1.05,
                                boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)"
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/analyzer')}
                        >
                            {/* Button Shine Effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                                animate={{ x: ["0%", "200%", "0%"] }}
                                transition={{ 
                                    duration: 3, 
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                            
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                Connect Your Profiles
                                <motion.span
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ 
                                        duration: 1.5, 
                                        repeat: Infinity,
                                        ease: "easeInOut" 
                                    }}
                                >
                                    →
                                </motion.span>
                            </span>
                        </motion.button>
                    </motion.div>

                    {/* Additional Info */}
                    <motion.p
                        className="text-gray-400 text-sm mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.6 }}
                    >
                        Get started in 2 minutes • No credit card required
                    </motion.p>
                </div>

                {/* Bottom Decorative Elements */}
                <motion.div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"
                    animate={{ 
                        width: ["0%", "100%", "0%"],
                        opacity: [0, 1, 0]
                    }}
                    transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "easeInOut" 
                    }}
                />
            </motion.div>
        </motion.div>
    );
}


function DashboardContent() {
    const searchParams = useSearchParams();
    const refreshParam = searchParams.get('refresh');
    
    const swrKey = refreshParam 
        ? `/api/indepth/profiles/enriched?refresh=${refreshParam}` 
        : '/api/indepth/profiles/enriched';

    const { data, error, isLoading } = useSWR(
        swrKey, 
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnMount: true,
            dedupingInterval: 2000,
            shouldRetryOnError: (error) => {
                // Don't retry on 404, but retry on network errors
                return error.status !== 404;
            },
        }
    );

    // Add debug logging to see what's happening
    console.log('Dashboard API Response:', { data, error, isLoading });

const renderContent = () => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

   if (error?.status === 404 || error?.status === 412) {
    return <NoAnalysisCard />;
}

    if (error) {
        // Show detailed error for network/connection issues
        return (
            <div className="flex flex-col items-center justify-center h-96 text-destructive">
                <AlertCircle className="w-12 h-12 mb-4" />
                <h2 className="text-2xl font-bold mb-2">
                    {error.status === 0 ? 'Network Error' : 'Analysis Failed'}
                </h2>
                <p className="text-center max-w-md">
                    {error.message}
                    {error.status === 0 && (
                        <span className="block text-sm mt-2 text-gray-400">
                            Please check your internet connection and try again.
                        </span>
                    )}
                </p>
                <Button 
                    className="mt-4"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </Button>
            </div>
        );
    }

    // Check if data exists but success is false (incomplete enrichment)
    if (data && !data.success) {
        return <DashboardContent />;
    }

    // If we get here, we have successful data - show the dashboard
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <motion.div variants={itemVariants}>
                <UserHeader user={{ fullName: data.fullName, email: data.email }} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PlatformStatus status={data.platformStatus} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-headline font-bold text-white mb-4">Overall Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <OverallScore score={data.combinedInsights.overallAssessment.combinedScore} level={data.combinedInsights.overallAssessment.skillLevel} />
                    <StrengthsAndWeaknesses
                        strengths={data.combinedInsights.overallAssessment.keyStrengths}
                        weaknesses={data.combinedInsights.overallAssessment.growthAreas}
                    />
                    <StatCard title="Primary Specialization" value={data.combinedInsights.overallAssessment.primarySpecialization} />
                </div>
            </motion.div>

            <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-headline font-bold text-white mb-4">GitHub Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <StatCard title="Primary Language" value={data.githubAnalysis.profileSummary.primaryLanguage} />
                   <StatCard title="Public Repos" value={data.githubAnalysis.profileSummary.publicRepoCount} />
                   <StatCard title="Followers" value={data.githubAnalysis.profileSummary.followerCount} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <LanguageDistributionChart data={data.githubAnalysis.analytics.languageAnalysis.distribution} />
                  <CommitActivityChart data={data.githubAnalysis.analytics.activityMetrics.last30DaysCommits} />
                </div>
                 <div className="mt-6">
                    <TopRepositories repos={data.githubAnalysis.profileSummary.repos} />
                </div>
                 {data.githubAnalysis.githubAnalysisReasoning && (
                    <div className="mt-6">
                         <GithubAnalysisReasoning reasoning={data.githubAnalysis.githubAnalysisReasoning} />
                    </div>
                )}
            </motion.div>

            <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-headline font-bold text-white mb-4">LeetCode Performance</h2>
                <LeetcodeStats
                    problemStats={data.leetcodeAnalysis.profileSummary.problemStats}
                    beatStats={data.leetcodeAnalysis.profileSummary.beatStats}
                    ranking={data.leetcodeAnalysis.profileSummary.ranking}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <ContestHistory data={data.leetcodeAnalysis.contestHistory} />
                    <RepoQualityRadar data={data.githubAnalysis.repoStructures} />
                </div>
            </motion.div>

            <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-headline font-bold text-white mb-4">Skill Assessment</h2>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SkillRadar data={data.skillAssessment.radarChart} />
                    <ImprovementPlan plan={data.skillAssessment.improvementPlan} />
                </div>
            </motion.div>

            <motion.div variants={itemVariants}>
                 <CareerRecommendations recommendations={data.combinedInsights.careerRecommendations} />
            </motion.div>
        </motion.div>
    );
};

return renderContent();
}

export default function DashboardPage() {
    const { state } = useSidebar();  // GET SIDEBAR STATE

    return (
        <div
            className={cn(
                "relative flex flex-col min-h-screen overflow-hidden transition-all duration-300",

                // Move content to the right depending on sidebar state
                state === "expanded" ? "md:pl-64" : "md:pl-20"
            )}
        >
            {/* Full-page background */}
            {/* Background (do NOT use opacity on parent) */}
<div className="absolute inset-0 -z-10 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f]/80 to-[#121826]/80" />
    <FloatingElements />
</div>


            {/* Content */}
            <div className="w-full px-4 sm:px-6 lg:px-8 pt-8 md:pt-24 pb-20">
                <Suspense fallback={
                    <div className="flex items-center justify-center h-96">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    </div>
                }>
                    <DashboardContent />
                </Suspense>
            </div>
        </div>
    );
}

