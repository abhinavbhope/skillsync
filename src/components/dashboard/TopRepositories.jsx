'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork, Workflow, Search, Folder, Loader2 } from "lucide-react"; // ✅ Fixed import
import RepoTreeView from './RepoTreeView';
import { Progress } from '../ui/progress';

const GlassmorphicCard = ({ children, className }) => (
    <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg ${className}`}>
        {children}
    </div>
);

const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
};

const getSafeValue = (obj, path, defaultValue = null) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) ?? defaultValue;
};

const TopRepositories = ({ repos, isLoading = false }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('qualityScore');

    const filteredAndSortedRepos = useMemo(() => {
        if (!repos) return [];
        
        return repos
            .filter(repo => {
                const repoName = getSafeValue(repo, 'repoName', '').toLowerCase();
                const primaryLanguage = getSafeValue(repo, 'primaryLanguage', '').toLowerCase();
                const searchLower = searchTerm.toLowerCase();
                return repoName.includes(searchLower) || primaryLanguage.includes(searchLower);
            })
            .sort((a, b) => {
                if (sortBy === 'qualityScore') {
                    return (getSafeValue(b, 'qualityScore', 0) - getSafeValue(a, 'qualityScore', 0));
                }
                if (sortBy === 'stars') {
                    return (getSafeValue(b, 'starCount', 0) - getSafeValue(a, 'starCount', 0));
                }
                return 0;
            });
    }, [repos, searchTerm, sortBy]);

    if (isLoading) {
        return (
            <GlassmorphicCard>
                <CardHeader>
                    <CardTitle>Top Repositories</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
                        <p className="text-gray-400">Loading repositories...</p>
                    </div>
                </CardContent>
            </GlassmorphicCard>
        );
    }

    if (!repos || repos.length === 0) {
        return (
            <GlassmorphicCard>
                <CardHeader>
                    <CardTitle>Top Repositories</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-gray-400">
                        <Folder className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No repositories to display.</p>
                    </div>
                </CardContent>
            </GlassmorphicCard>
        );
    }
    
    return (
        <GlassmorphicCard className="p-6">
            <CardHeader className="p-0 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    <div>
                        <CardTitle className="text-2xl font-bold font-headline text-white">
                            Repository Analysis
                        </CardTitle>
                        <CardDescription>
                            Detailed analysis of {repos.length} repositories
                        </CardDescription>
                    </div>
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search repositories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 w-64"
                            />
                        </div>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <option value="qualityScore">Sort by Quality</option>
                            <option value="stars">Sort by Stars</option>
                        </select>
                    </div>
                </div>
            </CardHeader>
            
            <CardContent className="p-0">
                {filteredAndSortedRepos.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No repositories match your search</p>
                    </div>
                ) : (
                    <Accordion type="single" collapsible className="w-full">
                        {filteredAndSortedRepos.map((repo, index) => {
                            const qualityScore = getSafeValue(repo, 'qualityScore', 0);
                            const repoName = getSafeValue(repo, 'repoName', 'Unnamed Repository');
                            const primaryLanguage = getSafeValue(repo, 'primaryLanguage', 'N/A');
                            const starCount = getSafeValue(repo, 'starCount', 0);
                            const forkCount = getSafeValue(repo, 'forkCount', 0);
                            const qualityReason = getSafeValue(repo, 'qualityReason', 'No quality reason available.');
                            const detectedPatterns = getSafeValue(repo, 'detectedPatterns', []);
                            const architectureScore = getSafeValue(repo, 'architectureScore', 0);
                            const testingSetupScore = getSafeValue(repo, 'testingSetupScore', 0);
                            const primaryArchitecture = getSafeValue(repo, 'repositoryStructure.primaryArchitecture', 'N/A');

                            return (
                                <AccordionItem value={`item-${index}`} key={repoName}>
                                    <AccordionTrigger>
                                        <div className="flex items-center justify-between w-full pr-4">
                                            <div className="flex items-center gap-3 text-left">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-primary/20 ${getScoreColor(qualityScore)} font-bold text-lg`}>
                                                    {qualityScore}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">{repoName}</p>
                                                    <p className="text-xs text-gray-400">{primaryLanguage}</p>
                                                </div>
                                            </div>
                                            <div className="hidden md:flex items-center gap-4 text-xs text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3 h-3"/> {starCount}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <GitFork className="w-3 h-3"/> {forkCount}
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <Tabs defaultValue="overview" className="w-full">
                                            <TabsList className="grid w-full grid-cols-3">
                                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                                <TabsTrigger value="structure">Structure</TabsTrigger>
                                                <TabsTrigger value="architecture">Architecture</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="overview" className="bg-black/20 p-4 rounded-b-md">
                                                <p className="text-sm text-gray-300 mb-4">{qualityReason}</p>
                                                {detectedPatterns.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {detectedPatterns.map(pattern => (
                                                            <Badge key={pattern} variant="secondary">{pattern}</Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </TabsContent>
                                            <TabsContent value="structure" className="bg-black/20 p-4 rounded-b-md">
                                               <RepoTreeView repository={repo} />
                                            </TabsContent>
                                            <TabsContent value="architecture" className="bg-black/20 p-4 rounded-b-md space-y-3">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-300">Primary Architecture</h4>
                                                    <p className="text-lg font-bold text-white">{primaryArchitecture}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-gray-400">Architecture Score</span>
                                                        <span className={getScoreColor(architectureScore)}>
                                                            {architectureScore}/100
                                                        </span>
                                                    </div>
                                                    <Progress value={architectureScore} className="h-2"/>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-gray-400">Testing Setup</span>
                                                        <span className={getScoreColor(testingSetupScore)}>
                                                            {testingSetupScore}/100
                                                        </span>
                                                    </div>
                                                    <Progress value={testingSetupScore} className="h-2"/>
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                )}
            </CardContent>
        </GlassmorphicCard>
    );
};

export default TopRepositories;