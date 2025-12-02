'use client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Github, Star, GitFork, Code, Activity, ShieldCheck, CheckCircle, Flame, CalendarDays, Zap, Target, Brain, Rocket, TrendingUp, Award, Trophy, BarChart3 } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Badge } from '../ui/badge';
import RepoTreeView from './RepoTreeView';
import PentagonalGraph from './PentagonalGraph';


const LeetCodeIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-full w-full"
    >
        <path d="M13.483 0L15.323 1.84L1.84 15.323L0 13.483L13.483 0ZM22.16 8.677L24 10.517L10.517 24L8.677 22.16L22.16 8.677Z"></path>
        <path d="M0 10.517L1.84 8.677L8.677 15.517L6.837 17.357L0 10.517Z"></path>
        <path d="M15.517 8.677L17.357 6.837L24 13.483L22.16 15.323L15.517 8.677Z"></path>
    </svg>
);

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const StatCard = ({ icon, label, value, description, className = "" }) => (
    <div className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-4 rounded-xl border border-white/10 flex flex-col backdrop-blur-sm ${className}`}>
        <div className="flex items-center gap-3 mb-2">
            {icon}
            <span className="text-sm text-gray-300 font-medium">{label}</span>
        </div>
        <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {value !== null && value !== undefined ? value.toLocaleString() : 'N/A'}
        </div>
        {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
    </div>
);

const ResultsDashboard = ({ results,leetcodeData  }) => {
    const { github, leetcode } = results || {};
    
    if (!github && !leetcode) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center p-8 text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                        <Zap className="w-8 h-8 text-gray-600" />
                    </div>
                    No data available to display.
                </div>
            </div>
        );
    }

    const lcProblemStats = leetcode?.problemStats || {};
    const hasBeatStats = leetcode?.beatStats && leetcode.beatStats.length > 0;
    
    const safeFormatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
        } catch (error) {
            return "Invalid Date";
        }
    };
    
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full grid grid-cols-1 gap-8"
        >
            {/* GitHub Card */}
            {github && (
                <motion.div variants={itemVariants}>
                    <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-white/10 backdrop-blur-sm shadow-2xl overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                        <Github className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="font-headline text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                            {github?.githubUsername || 'N/A'}
                                        </CardTitle>
                                        <CardDescription className="text-gray-400">
                                            Last synced: {safeFormatDate(github.lastSyncedAt)}
                                        </CardDescription>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                    GitHub
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatCard icon={<Star className="text-yellow-400 w-5 h-5"/>} label="Total Stars" value={github?.totalStars} />
                                <StatCard icon={<Code className="text-blue-400 w-5 h-5"/>} label="Public Repos" value={github?.publicRepoCount} />
                                <StatCard icon={<Activity className="text-green-400 w-5 h-5"/>} label="Commits" value={github?.lastYearCommits} description="last year"/>
                                <StatCard icon={<ShieldCheck className="text-indigo-400 w-5 h-5"/>} label="Followers" value={github?.followerCount} />
                            </div>
                            
                            {github?.primaryLanguage && (
                                <div className="bg-gray-800/50 rounded-xl p-4 border border-white/5">
                                    <h4 className="font-semibold mb-3 text-gray-200">Primary Language</h4>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-lg font-bold text-white">{github.primaryLanguage}</span>
                                        <span className="text-sm font-semibold text-primary">{github.primaryLanguagePct || 0}%</span>
                                    </div>
                                    <Progress value={github.primaryLanguagePct || 0} className="h-2" />
                                </div>
                            )}

                            {github?.repos && github.repos.length > 0 && (
                                <div className="bg-gray-800/50 rounded-xl p-4 border border-white/5">
                                    <h4 className="font-semibold mb-4 text-gray-200 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-400" />Top Repositories</h4>
                                    <Accordion type="single" collapsible className="w-full space-y-2">
                                        {github.repos.slice(0, 5).map((repo, index) => (
                                            <AccordionItem key={repo.repoName + index} value={`item-${index}`} className="bg-black/20 rounded-lg border-white/10">
                                                <AccordionTrigger className="px-4 py-3 text-base font-medium hover:no-underline data-[state=open]:bg-white/5 rounded-t-lg">
                                                    <div className="flex flex-col md:flex-row md:items-center gap-x-4 gap-y-1 text-left w-full">
                                                        <span className="font-semibold text-white flex-grow">{repo.repoName}</span>
                                                        <div className="flex items-center gap-4 text-xs text-gray-400">
                                                            <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500" /> {repo.starCount?.toLocaleString() || 0}</span>
                                                            <span className="flex items-center gap-1"><GitFork className="w-3 h-3 text-blue-400" /> {repo.forkCount?.toLocaleString() || 0}</span>
                                                            <Badge variant="outline" className="text-xs">{repo.primaryLanguage || 'N/A'}</Badge>
                                                            <Badge variant="outline" className={cn("text-xs", repo.repositoryStructure ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-300")}>
                                                                {repo.repositoryStructure ? "Analyzed" : "No Structure"}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="p-4 border-t border-white/10">
                                                    <RepoTreeView repository={repo} />
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* LeetCode Card */}
            {leetcode && (
                <motion.div variants={itemVariants}>
                    <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-white/10 backdrop-blur-sm shadow-2xl overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg"><div className="w-6 h-6 text-white"><LeetCodeIcon /></div></div>
                                    <div>
                                        <CardTitle className="font-headline text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{leetcode?.leetcodeUsername || 'N/A'}</CardTitle>
                                        <CardDescription className="text-gray-400">Global Ranking: #{leetcode.ranking?.toLocaleString() || 'N/A'}</CardDescription>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30">LeetCode</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                               <div className="bg-gray-800/30 rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center">
                                    <h4 className="font-semibold mb-4 text-lg text-gray-200">Skills Overview</h4>
                                    <PentagonalGraph leetcodeData={leetcodeData}/>
                                </div>
                                <div className="space-y-6">
                                    <StatCard icon={<Trophy className="text-yellow-500 w-5 h-5" />} label="Total Solved" value={lcProblemStats.totalSolved} description="Problems" />
                                    <StatCard icon={<Award className="text-purple-400 w-5 h-5" />} label="Global Rank" value={leetcode.ranking} />
                                    <StatCard icon={<Target className="text-blue-500 w-5 h-5"/>} label="Acceptance Rate" value={lcProblemStats.acceptedSubmissions && lcProblemStats.totalSubmissions ? Math.round((lcProblemStats.acceptedSubmissions / lcProblemStats.totalSubmissions) * 100) : 0} description="%" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </motion.div>
    );
};

export default ResultsDashboard;
