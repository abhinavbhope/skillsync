'use client';

import { useState, useTransition, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Input } from '../ui/input';
import { Github, Code, Star, MoreVertical, Trash2, Edit, Loader2, Crown, GitCommit, Trophy, Users, CheckCircle, Rocket, ArrowRight } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { getGithubStats, getLeetcodeProfile, deleteProfileCombination, updateProfileCombination, setPrimaryCombination, getEnrichmentStatus } from '@/lib/analyzerApi';
import ResultsDashboard from './results-dashboard';
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import { Badge } from '../ui/badge';
import { useRouter } from 'next/navigation';

const StatItem = ({ icon, label, value }) => (
    <div className="flex items-center gap-2 text-sm text-gray-400">
        {icon}
        <span className="font-semibold text-gray-200">{value !== null && value !== undefined ? value.toLocaleString() : 0}</span>
        <span className="truncate">{label}</span>
    </div>
);

const ProfileCard = ({ profile, onDeleted, onUpdated,onTriggerEnrichment, isNew = false }) => {
    const { toast } = useToast();
    const router = useRouter();
    const [isDeleting, startDeleteTransition] = useTransition();
    const [isUpdating, startUpdateTransition] = useTransition();
    const [isSettingPrimary, startPrimaryTransition] = useTransition();
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(profile.profileName);
    const [isEnriched, setIsEnriched] = useState(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState(true);

    const [stats, setStats] = useState(null);
    const [isLoadingStats, setIsLoadingStats] = useState(false);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    
    // Analysis state
    const [isAnalyzing, setIsAnalyzing] = useState(isNew);
    const pollIntervalRef = useRef(null);
    const pollTimeoutRef = useRef(null);
    
     useEffect(() => {
        const checkEnrichment = async () => {
            if (profile.primary) {
                try {
                    const status = await getEnrichmentStatus();
                    if (status && status.enriched) {
                        setIsEnriched(true);
                    }
                } catch (error) {
                    console.error("Failed to check enrichment status:", error);
                } finally {
                    setIsCheckingStatus(false);
                }
            } else {
                setIsCheckingStatus(false);
            }
        };
        checkEnrichment();
    }, [profile.primary]);


    const safeFormatDate = (dateString) => {
        if (!dateString) return "Analysis time unknown";
        try {
            const date = parseISO(dateString);
            // Check if the parsed date is valid
            if (isNaN(date.getTime())) {
                return "Analysis time invalid";
            }
            return formatDistanceToNow(date, { addSuffix: true });
        } catch (error) {
            console.error("Invalid date value:", dateString);
            return "Analysis time invalid";
        }
    };
    
    const stopPolling = useCallback(() => {
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
        }
        if (pollTimeoutRef.current) {
            clearTimeout(pollTimeoutRef.current);
            pollTimeoutRef.current = null;
        }
    }, []);

    const pollAnalysisStatus = useCallback(async () => {
        if (!profile.githubUsername) return;
        try {
            console.log(`[Polling] Checking status for GitHub user: ${profile.githubUsername}`);
            const githubData = await getGithubStats(profile.githubUsername);
            
            const analysisComplete = githubData?.repos?.some(repo => repo.repositoryStructure);

            if (analysisComplete) {
                console.log(`[Polling] ✅ Analysis complete for ${profile.combinationId}`);
                setIsAnalyzing(false);
                setStats(prevStats => ({
                    ...prevStats,
                    github: githubData
                }));
                onUpdated({ ...profile, repos: githubData.repos }); 
                stopPolling();
                
                toast({
                    title: "Analysis Complete",
                    description: `Detailed analysis for "${profile.profileName}" is now ready.`,
                    action: <CheckCircle className="text-green-500" />
                });
            } else {
                console.log(`[Polling] ⏳ Analysis still in progress for ${profile.combinationId}`);
            }
        } catch (error) {
            console.error(`[Polling] ❌ Error checking status:`, error);
        }
    }, [profile.combinationId, profile.githubUsername, profile.profileName, onUpdated, stopPolling, toast]);

    useEffect(() => {
        if (isNew) {
            console.log(`[ProfileCard] Starting analysis polling for new combination: ${profile.combinationId}`);
            setIsAnalyzing(true);
            
            pollIntervalRef.current = setInterval(pollAnalysisStatus, 8000); 

            pollTimeoutRef.current = setTimeout(() => {
                if (pollIntervalRef.current) { 
                    console.warn(`[ProfileCard] ⏰ Polling timeout for ${profile.combinationId}`);
                    stopPolling();
                    setIsAnalyzing(false);
                    toast({
                        variant: 'destructive',
                        title: 'Analysis Taking Longer Than Expected',
                        description: 'The repository analysis is still processing. You can check back in a few moments.',
                    });
                }
            }, 180000); 
        }

        return stopPolling;
    }, [isNew, profile.combinationId, pollAnalysisStatus, stopPolling, toast]);


    const handleFetchStats = async () => {
        if (stats || isLoadingStats) {
            return;
        }
        setIsLoadingStats(true);
        try {
            const [githubData, leetcodeData] = await Promise.all([
                getGithubStats(profile.githubUsername),
                getLeetcodeProfile(profile.leetcodeUsername)
            ]);
            
            const transformedStats = {
                github: githubData,
                leetcode: leetcodeData
            };
            setStats(transformedStats);

            const analysisComplete = githubData?.repos?.some(repo => repo.repositoryStructure);
            if(isAnalyzing && analysisComplete) {
                setIsAnalyzing(false);
                stopPolling();
            }

        } catch (error) {
            toast({ 
                variant: 'destructive', 
                title: 'Error', 
                description: error.message || 'Could not load detailed stats.' 
            });
            console.error('Error fetching stats:', error);
        } finally {
            setIsLoadingStats(false);
        }
    };

    const handleDelete = () => {
        startDeleteTransition(async () => {
            try {
                await deleteProfileCombination(profile.combinationId);
                toast({ title: 'Success', description: 'Profile deleted successfully.' });
                onDeleted(profile.combinationId);
            } catch (error) {
                toast({ 
                    variant: 'destructive', 
                    title: 'Error', 
                    description: error.message || 'Failed to delete profile.' 
                });
            }
        });
    };
    
    const handleUpdateName = () => {
        if (editedName === profile.profileName || !editedName.trim()) {
            setIsEditing(false);
            return;
        }
        startUpdateTransition(async () => {
            try {
                const updatedData = await updateProfileCombination(profile.combinationId, { profileName: editedName.trim(), makePrimary: profile.primary });
                toast({ title: 'Success', description: 'Profile name updated.' });
                onUpdated(updatedData);
                setIsEditing(false);
            } catch (error) {
                toast({ 
                    variant: 'destructive', 
                    title: 'Error', 
                    description: error.message || 'Failed to update profile name.' 
                });
            }
        });
    };
    
    const handleSetPrimary = () => {
        if (profile.primary) return;
        startPrimaryTransition(async () => {
            try {
                await setPrimaryCombination(profile.combinationId);
                toast({ 
                    title: 'Success', 
                    description: `"${profile.profileName}" is now the primary profile.` 
                });
                onUpdated({ ...profile, primary: true }, true);
            } catch (error) {
                toast({ 
                    variant: 'destructive', 
                    title: 'Error', 
                    description: error.message || 'Failed to set as primary.' 
                });
            }
        });
    }

    return (
        <Card className="bg-card/50 border-white/10 backdrop-blur-sm flex flex-col transition-all duration-300 w-full hover:shadow-primary/20 hover:shadow-lg">
            <CardHeader className="flex-row justify-between items-start">
                <div>
                    {isEditing ? (
                        <div className="flex gap-2 items-center w-full max-w-sm">
                            <Input
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="h-9"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleUpdateName();
                                    if (e.key === 'Escape') setIsEditing(false);
                                }}
                            />
                            <Button size="icon" className="h-9 w-9 shrink-0" onClick={handleUpdateName} disabled={isUpdating}>
                                {isUpdating ? <Loader2 className="animate-spin" /> : <CheckCircle />}
                            </Button>
                        </div>
                    ) : (
                         <CardTitle className="font-headline text-xl flex items-center gap-2">
                            {profile.primary && <Crown className="w-5 h-5 text-amber-400" />}
                            {profile.profileName}
                             {profile.primary && isEnriched && (
                                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">✓ Enriched</Badge>
                            )}
                        </CardTitle>
                    )}
                     <CardDescription>
                        {isAnalyzing ? (
                            <span className="text-amber-400 animate-pulse flex items-center gap-2">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Analyzing Repository Structure...
                            </span>
                        ) : (
                            `Analyzed ${safeFormatDate(profile.analyzedAt)}`
                        )}
                    </CardDescription>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            <MoreVertical />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {!profile.primary && (
                            <DropdownMenuItem onClick={handleSetPrimary} disabled={isSettingPrimary}>
                                {isSettingPrimary ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Crown className="mr-2 h-4 w-4" />}
                                Set as Primary
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => setIsEditing(true)} disabled={isEditing}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Name
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500 focus:text-red-500">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete the "{profile.profileName}" profile. This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                                        {isDeleting ? <Loader2 className="animate-spin" /> : 'Delete'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>

            <CardContent className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-300 flex items-center gap-2">
                        <Github className="w-4 h-4" /> GitHub
                    </h4>
                    <div className="flex items-center gap-2 p-2 bg-black/20 rounded-md text-sm">
                        <span className="font-mono">{profile.githubUsername}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <StatItem icon={<GitCommit className="w-4 h-4 text-blue-400" />} label="Public Repos" value={profile.githubPublicRepos} />
                        <StatItem icon={<Users className="w-4 h-4 text-green-400" />} label="Followers" value={profile.githubFollowers} />
                    </div>
                </div>
                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-300 flex items-center gap-2">
                        <Code className="w-4 h-4" /> LeetCode
                    </h4>
                    <div className="flex items-center gap-2 p-2 bg-black/20 rounded-md text-sm">
                        <span className="font-mono">{profile.leetcodeUsername}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <StatItem icon={<Star className="w-4 h-4 text-purple-400" />} label="Problems Solved" value={profile.leetcodeTotalSolved} />
                        <StatItem icon={<Trophy className="w-4 h-4 text-amber-400" />} label="Global Rank" value={profile.leetcodeRanking} />
                    </div>
                </div>
            </CardContent>
             {profile.primary && !isCheckingStatus && (
                <div className="px-6 pb-4">
                    {isEnriched ? (
                        <Button
                            size="lg"
                            onClick={() => router.push('/dashboard')}
                            className="w-full group bg-gradient-to-r from-slate-800 to-slate-700 text-white hover:shadow-lg hover:shadow-slate-500/30 transition-all duration-300 transform hover:scale-105"
                        >
                            Go to Dashboard
                            <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            onClick={onTriggerEnrichment}
                            className="w-full group bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 transform hover:scale-105"
                            disabled={isAnalyzing}
                        >
                            {isAnalyzing ? (
                                <Loader2 className="mr-3 animate-spin" />
                            ) : (
                                <Rocket className="mr-3" />
                            )}
                            {isAnalyzing ? 'Analyzing...' : 'Get Insights with AI'}
                        </Button>
                    )}
                </div>
            )}


            <CardFooter className="p-0 mt-auto">
                <Accordion type="single" collapsible className="w-full" onValueChange={(value) => setIsAccordionOpen(!!value)} disabled={isAnalyzing}>
                    <AccordionItem value="item-1" className="border-t border-white/10">
                        <AccordionTrigger 
                            onClick={handleFetchStats} 
                            className="px-6 py-4 text-sm font-semibold hover:no-underline data-[state=open]:bg-white/5 disabled:text-gray-500 disabled:cursor-not-allowed"
                             disabled={isAnalyzing}
                        >
                           {isAnalyzing ? (
                                <span className="flex items-center text-amber-400">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                                    Repository Analysis in Progress...
                                </span>
                            ) : isLoadingStats ? (
                                <span className="flex items-center">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                                    Loading Detailed Analysis...
                                </span>
                            ) : isAccordionOpen ? 'Hide Detailed Analysis' : 'View Detailed Analysis'}
                        </AccordionTrigger>
                        <AccordionContent className="p-6 bg-black/20 border-t border-white/10">
                            {isLoadingStats && <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>}
                            {stats && <ResultsDashboard results={stats} leetcodeData={stats?.leetcode}/>}
                            {!isLoadingStats && !stats && <div className="text-center text-gray-500 p-8">Click above to load detailed analysis</div>}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardFooter>
        </Card>
    );
};

export default ProfileCard;
