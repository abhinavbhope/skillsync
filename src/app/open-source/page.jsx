'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { generateRecommendations, getStatus, getResults, getSaved } from '@/lib/projectFinderApi';
import { Loader2, Zap, BrainCircuit, Search, CheckCircle, ArrowRight, Star, GitFork, AlertTriangle, ExternalLink, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import FloatingElements from '@/components/dashboard/FloatingElements';
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardHover = {
  scale: 1.02,
  y: -4,
  transition: { type: "spring", stiffness: 300 }
};
const HeroSection = ({ scrollToExplore }) => {
  return (
    <section className="relative w-full pt-32 pb-24 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent blur-3xl opacity-40"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto px-6 text-center relative z-10"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold font-headline text-white drop-shadow-lg">
          Your Next  
          <span className="text-primary glow-text"> Open-Source Journey</span>
          <br /> Starts Here
        </h1>

        <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mt-6 leading-relaxed">
          Discover high-impact open-source projects tailored to your skills, coding patterns,  
          and future growth. Powered by deep GitHub analysis + AI matching.
        </p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10"
        >
          <Button size="lg" onClick={scrollToExplore} className="px-10 py-6 text-lg rounded-xl shadow-lg shadow-primary/20">
            Start Exploring <ArrowRight className="ml-2" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Floating Lights */}
      <div className="absolute top-20 left-32 w-72 h-72 bg-primary/20 blur-[140px] rounded-full opacity-40"></div>
      <div className="absolute bottom-10 right-32 w-72 h-72 bg-cyan-500/20 blur-[140px] rounded-full opacity-40"></div>
    </section>
  );
};
const FeatureSection = ({ title, desc, image, reverse }) => {
  return (
    <section className="py-20 md:py-28 px-6">
      <div className={`max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center ${
        reverse ? "md:flex-row-reverse" : ""
      }`}>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: reverse ? 100 : -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {title}
          </h2>
          <p className="text-gray-300 text-lg max-w-xl leading-relaxed">{desc}</p>
        </motion.div>

        {/* Card / Image */}
        <motion.div
          initial={{ opacity: 0, x: reverse ? -100 : 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="glass-card rounded-2xl border border-white/10 p-4 shadow-2xl shadow-primary/10 hover:shadow-primary/30 transition-all duration-300">
            <img
              src={image}
              className="rounded-xl w-full h-72 object-cover"
            />

            {/* Neon border glow */}
            <div className="absolute inset-0 rounded-2xl border border-primary/30 blur-md opacity-30"></div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
const LandingSections = ({ scrollToExplore }) => {
  return (
    <>
      <HeroSection  scrollToExplore={scrollToExplore} />

      <FeatureSection
        title="AI-Powered GitHub Skill Analysis"
        desc="We break down your languages, commit patterns, architecture preferences, repositories, and coding signatures to deeply understand your engineering style."
        image="/ai-github.png"
        reverse={false}
      />

      <FeatureSection
        title="Smart Matching Across Thousands of Projects"
        desc="Our intelligent engine compares your skill profile with active open-source repositories and finds the best matches based on difficulty, alignment, and domain relevance."
        image="/matching.png"
        reverse={true}
      />

      <FeatureSection
        title="Clear Insights for Better Contributions"
        desc="Understand project structure, tech stack, difficulty, and contribution paths. Perfect for beginners, intermediate developers, and professionals leveling up."
        image="/last.png"
        reverse={false}
      />
    </>
  );
};

const NotLoggedInCard = () => {
    const router = useRouter();
    return (
        <Card className="glass-card max-w-lg mx-auto text-center">
            <CardHeader>
                <CardTitle className="text-2xl font-headline">Unlock Project Recommendations</CardTitle>
                <CardDescription>
                    Sign in to get personalized open-source project recommendations based on your GitHub profile.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => router.push('/')}>
                    <Zap className="mr-2" />
                    Login to Get Started
                </Button>
            </CardContent>
        </Card>
    );
};

const InputCard = ({ onGenerate, isLoading, userProfile }) => {
    const [maxRecommendations, setMaxRecommendations] = useState(10);
    const [analyzeStructures, setAnalyzeStructures] = useState(true);
    const [forceRefresh, setForceRefresh] = useState(false);

    const handleSubmit = () => {
        onGenerate({ 
            forceRefresh, 
            maxRecommendations, 
            analyzeStructures 
        });
    };

    return (
        <motion.div variants={pageVariants} className="w-full max-w-2xl mx-auto">
            <Card className="glass-card">
                <CardHeader className="text-center">
                    <Zap className="mx-auto h-10 w-10 text-primary mb-2" />
                    <CardTitle className="text-3xl font-headline">Open Source Project Finder</CardTitle>
                    <CardDescription>Discover projects perfectly matching your GitHub expertise.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                        <h4 className="font-semibold text-white flex items-center mb-3"><BrainCircuit className="mr-2 text-cyan-400" />We'll analyze your:</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" />GitHub languages & coding patterns</li>
                            <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" />Code architecture & structure preferences</li>
                            <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" />Skill level and technical domains</li>
                        </ul>
                    </div>
                    
                    <div className="bg-black/20 p-4 rounded-lg border border-white/10 space-y-4">
                        <h4 className="font-semibold text-white">Configuration</h4>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="max-recs">Max Recommendations</Label>
                            <Select value={maxRecommendations} onValueChange={setMaxRecommendations}>
  <SelectTrigger className="w-40">
    <SelectValue placeholder="Select max" />
  </SelectTrigger>
  <SelectContent>
    {[1, 2, 3, 4, 5].map(num => (
      <SelectItem key={num} value={String(num)}>
        {num}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="analyze-structures" checked={analyzeStructures} onCheckedChange={setAnalyzeStructures} />
                            <Label htmlFor="analyze-structures">Analyze project structures</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="force-refresh" checked={forceRefresh} onCheckedChange={setForceRefresh} />
                            <Label htmlFor="force-refresh">Force refresh from latest data</Label>
                        </div>
                    </div>

                    {userProfile && (
                         <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                            <h4 className="font-semibold text-white mb-2">Your Tech Profile (from GitHub)</h4>
                            <div className="flex flex-wrap gap-2 text-xs">
                                <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full">{userProfile.primaryLanguage}</span>
                                 <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">{userProfile.derivedLevel}</span>
                                {userProfile.repos?.slice(0, 2).map(r => r.detectedPatterns).flat().slice(0, 2).map(p => (
                                     <span key={p} className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">{p}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <Button size="lg" className="w-full text-lg py-6" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Zap className="mr-2" />}
                        {isLoading ? 'Generating...' : 'Generate Recommendations'}
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const LoadingState = ({ status }) => {
    const progress = useMemo(() => {
        const statusMap = {
            'PENDING': 10,
            'EXTRACTED_PROFILE': 20,
            'DOMAINS_EXTRACTED': 30,
            'SEARCH_COMPLETED': 50,
            'ANALYZED_PROJECTS': 70,
            'COMPLETED': 100,
            'FAILED': 100
        };
        return statusMap[status] || 10;
    }, [status]);

    const getStatusMessage = () => {
        const messages = {
            'PENDING': 'Starting recommendation engine...',
            'EXTRACTED_PROFILE': 'Extracted your GitHub profile',
            'DOMAINS_EXTRACTED': 'Analyzed your technical domains',
            'SEARCH_COMPLETED': 'Searching matching projects...',
            'ANALYZED_PROJECTS': 'Analyzing project structures...',
            'COMPLETED': 'Finalizing recommendations...',
            'FAILED': 'Process failed'
        };
        return messages[status] || 'Processing...';
    };

    return (
        <motion.div variants={pageVariants} className="w-full max-w-2xl mx-auto">
            <Card className="glass-card">
                <CardHeader className="text-center">
                    <Loader2 className="mx-auto h-10 w-10 text-primary animate-spin mb-2" />
                    <CardTitle className="text-3xl font-headline">Finding Your Matches...</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center text-gray-300">
                        <p className="text-lg">{getStatusMessage()}</p>
                        <p className="text-sm mt-2">Scanning hundreds of open source projects for perfect matches</p>
                    </div>

                    <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                        <h4 className="font-semibold text-white mb-2">Progress ({progress}%)</h4>
                        <Progress value={progress} className="w-full mb-3" />
                        <ul className="text-sm text-gray-300 space-y-1">
                            <li className="flex items-center gap-2">
                                {progress >= 20 ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Loader2 className="w-4 h-4 animate-spin"/>}
                                <span>GitHub profile extracted</span>
                            </li>
                            <li className="flex items-center gap-2">
                                {progress >= 30 ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Loader2 className="w-4 h-4 animate-spin"/>}
                                <span>Technical domains analyzed</span>
                            </li>
                            <li className="flex items-center gap-2">
                                {progress >= 50 ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Loader2 className="w-4 h-4 animate-spin"/>}
                                <span>Project search completed</span>
                            </li>
                            <li className="flex items-center gap-2">
                                {progress >= 70 ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Loader2 className="w-4 h-4 animate-spin"/>}
                                <span>Structure analysis</span>
                            </li>
                            <li className="flex items-center gap-2">
                                {progress >= 100 ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Loader2 className="w-4 h-4 animate-spin"/>}
                                <span>AI matching & ranking</span>
                            </li>
                        </ul>
                    </div>
                    <p className="text-center text-sm text-gray-500">Estimated time: 15-30 seconds</p>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const ResultsDisplay = ({ results, onReset }) => {
    const router = useRouter();
    
    return (
        <motion.div variants={pageVariants} className="w-full max-w-6xl mx-auto">
            <Card className="glass-card">
                <CardHeader className="text-center">
                    <CheckCircle className="mx-auto h-10 w-10 text-green-400 mb-2" />
                    <CardTitle className="text-3xl font-headline">{results.length} Projects Found</CardTitle>
                    <CardDescription>Personalized open-source projects matching your skills</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <motion.div 
                        variants={staggerContainer} 
                        initial="hidden" 
                        animate="show" 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-2"
                    >
                        {results.map((project, index) => (
                             <motion.div key={`${project.projectName}-${index}`} variants={pageVariants} whileHover={cardHover}>
                                 <Card className="bg-black/20 h-full flex flex-col glass-card border border-white/10 hover:border-primary/30 transition-all">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg text-primary flex items-center justify-between">
                                            {project.projectName}
                                            <ExternalLink className="w-4 h-4 text-gray-400" />
                                        </CardTitle>
                                        <CardDescription className="text-gray-400">by {project.owner}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow space-y-3 text-sm">
                                        <p className="text-gray-300 line-clamp-3">{project.description || 'No description available'}</p>
                                        
                                        <div className="flex items-center gap-4 text-xs text-gray-400 pt-2">
                                            <span className="flex items-center"><Star className="w-3 h-3 mr-1" />{project.stars || 0}</span>
                                            <span className="flex items-center"><GitFork className="w-3 h-3 mr-1" />{project.forks || 0}</span>
                                            <span className="flex items-center"><AlertTriangle className="w-3 h-3 mr-1" />{project.openIssues || 0}</span>
                                        </div>
                                        
                                        {project.primaryLanguage && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                                                    {project.primaryLanguage}
                                                </span>
                                            </div>
                                        )}
                                        
                                        {project.matchReason && (
                                            <p className="text-xs text-amber-300 line-clamp-2">
                                                💡 {project.matchReason}
                                            </p>
                                        )}
                                    </CardContent>
                                    <div className="p-4 pt-0 flex gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => window.open(project.projectUrl, '_blank')}
                                            className="flex-1"
                                        >
                                            View Repository
                                        </Button>
                                        <Button size="sm" variant="secondary">
                                            Save
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                    
                    <div className="text-center pt-4 border-t border-white/10">
                        <p className="text-amber-400 text-sm mb-4">
                            💡 Check the dashboard for in-depth analysis with detailed metrics and contribution insights!
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Button onClick={onReset} variant="outline">
                                Generate New Recommendations
                            </Button>
                            <Button onClick={() => router.push('/dashboard')}>
                                View Detailed Analysis <ArrowRight className="ml-2" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const SavedRecommendationsCard = ({ recommendations, onDelete, onRegenerate }) => {
    const router = useRouter();
    const stats = useMemo(() => {
        if (!recommendations || recommendations.length === 0) return null;
        
        return {
            total: recommendations.length,
            totalStars: recommendations.reduce((sum, proj) => sum + (proj.stars || 0), 0),
            totalForks: recommendations.reduce((sum, proj) => sum + (proj.forks || 0), 0),
            languages: [...new Set(recommendations.map(proj => proj.primaryLanguage).filter(Boolean))],
            avgStars: Math.round(recommendations.reduce((sum, proj) => sum + (proj.stars || 0), 0) / recommendations.length)
        };
    }, [recommendations]);

    if (!recommendations || recommendations.length === 0) return null;

    return (
        <motion.div variants={pageVariants} className="w-full max-w-4xl mx-auto">
            <Card className="glass-card">
                <CardHeader className="text-center">
                    <CheckCircle className="mx-auto h-10 w-10 text-green-400 mb-2" />
                    <CardTitle className="text-3xl font-headline">Your Project Recommendations</CardTitle>
                    <CardDescription>
                        You have {recommendations.length} personalized open-source project recommendations
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-black/20 p-4 rounded-lg border border-white/10 text-center">
                            <div className="text-2xl font-bold text-primary">{stats.total}</div>
                            <div className="text-sm text-gray-400">Projects</div>
                        </div>
                        <div className="bg-black/20 p-4 rounded-lg border border-white/10 text-center">
                            <div className="text-2xl font-bold text-yellow-400">{stats.avgStars}</div>
                            <div className="text-sm text-gray-400">Avg Stars</div>
                        </div>
                        <div className="bg-black/20 p-4 rounded-lg border border-white/10 text-center">
                            <div className="text-2xl font-bold text-blue-400">{stats.totalStars}</div>
                            <div className="text-sm text-gray-400">Total Stars</div>
                        </div>
                        <div className="bg-black/20 p-4 rounded-lg border border-white/10 text-center">
                            <div className="text-2xl font-bold text-green-400">{stats.totalForks}</div>
                            <div className="text-sm text-gray-400">Total Forks</div>
                        </div>
                    </div>

                    {/* Languages */}
                    {stats.languages.length > 0 && (
                        <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                            <h4 className="font-semibold text-white mb-2">Technologies</h4>
                            <div className="flex flex-wrap gap-2">
                                {stats.languages.map(lang => (
                                    <span key={lang} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                                        {lang}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick Project Preview */}
                    <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                        <h4 className="font-semibold text-white mb-3">Project Preview</h4>
                        <div className="space-y-3 max-h-40 overflow-y-auto">
                            {recommendations.slice(0, 5).map((project, index) => (
                                <div key={index} className="flex items-center justify-between p-2 hover:bg-white/5 rounded">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <span className="text-sm font-medium text-white">{project.projectName}</span>
                                        <span className="text-xs text-gray-400">by {project.owner}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                                        <Star className="w-3 h-3" />
                                        <span>{project.stars || 0}</span>
                                    </div>
                                </div>
                            ))}
                            {recommendations.length > 5 && (
                                <div className="text-center text-sm text-gray-500">
                                    + {recommendations.length - 5} more projects
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-center pt-4 border-t border-white/10">
                        <Button onClick={onRegenerate} variant="outline" className="flex items-center">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Regenerate
                        </Button>
                        <Button 
    onClick={() => router.push('/dashboard/opensource')}
    className="flex items-center"
>
    View Full Analysis
    <ArrowRight className="w-4 h-4 ml-2" />
</Button>

                        <Button onClick={onDelete} variant="destructive" className="flex items-center">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete All
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default function OpenSourcePage() {
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const [pageState, setPageState] = useState('loading'); // Start with loading to check saved
    const [status, setStatus] = useState('PENDING');
    const [results, setResults] = useState([]);
    const [jobId, setJobId] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const pollInterval = useRef(null);
    const exploreRef = useRef(null);

    const scrollToExplore = () => {
  exploreRef.current?.scrollIntoView({ behavior: "smooth" });
};

    // Load saved recommendations on mount
    useEffect(() => {
        if (user) {
            loadSavedRecommendations();
        } else if (!authLoading) {
            setPageState('input');
        }
    }, [user, authLoading]);

    const loadSavedRecommendations = async () => {
        try {
            const saved = await getSaved();
            console.log('Saved recommendations:', saved);
            
            if (saved && saved.recommendations && saved.recommendations.length > 0) {
                setResults(saved.recommendations);
                setPageState('saved');
                toast({
                    title: 'Welcome back!',
                    description: `Loaded ${saved.recommendations.length} saved recommendations`
                });
            } else {
                setPageState('input');
            }
        } catch (error) {
            console.log('No saved recommendations found or error:', error);
            setPageState('input');
        }
    };

    const stopPolling = useCallback(() => {
        if (pollInterval.current) {
            clearInterval(pollInterval.current);
            pollInterval.current = null;
        }
    }, []);
    
    const pollForStatus = useCallback((id) => {
        pollInterval.current = setInterval(async () => {
            try {
                const statusRes = await getStatus(id);
                console.log('Polling status:', statusRes);
                
                // Update status for progress display
                setStatus(statusRes.status || 'PENDING');

                if (statusRes.status === 'COMPLETED') {
                    stopPolling();
                    try {
                        const resultsRes = await getResults(id);
                        console.log('Results received:', resultsRes);
                        
                        if (resultsRes.recommendations && resultsRes.recommendations.length > 0) {
                            setResults(resultsRes.recommendations);
                            setPageState('saved'); // Changed from 'results' to 'saved'
                            toast({ 
                                title: 'Success!', 
                                description: `Found ${resultsRes.recommendations.length} projects matching your skills` 
                            });
                        } else {
                            throw new Error('No recommendations found in response');
                        }
                    } catch (error) {
                        console.error('Error fetching results:', error);
                        toast({ 
                            variant: 'destructive', 
                            title: 'Results Error', 
                            description: 'Failed to load recommendations' 
                        });
                        setPageState('input');
                    }
                } else if (statusRes.status === 'FAILED') {
                    stopPolling();
                    toast({ 
                        variant: 'destructive', 
                        title: 'Generation Failed', 
                        description: statusRes.errorMessage || 'Unknown error occurred' 
                    });
                    setPageState('input');
                }
            } catch (error) {
                console.error('Polling error:', error);
                // Don't stop polling on individual errors, just log them
            }
        }, 3000);
    }, [toast, stopPolling]);

    const handleGenerate = async (config) => {
        setPageState('loading');
        setStatus('PENDING');
        setResults([]);
        
        try {
            console.log('Starting generation with config:', config);
            const res = await generateRecommendations(config);
            console.log('Generation started:', res);
            
            if (res.jobId) {
                setJobId(res.jobId);
                pollForStatus(res.jobId);
            } else {
                throw new Error("No job ID received from server");
            }
        } catch (error) {
            console.error('Generation error:', error);
            toast({ 
                variant: 'destructive', 
                title: 'Generation Error', 
                description: error.message 
            });
            setPageState('input');
        }
    };

    const handleDelete = async () => {
        try {
            // You'll need to implement deleteRecommendations in your API
            // For now, just clear local state
            setResults([]);
            setPageState('input');
            toast({
                title: 'Recommendations deleted',
                description: 'Your project recommendations have been cleared'
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Delete failed',
                description: error.message
            });
        }
    };

    const handleRegenerate = () => {
        setPageState('input');
    };
    
    useEffect(() => {
        return () => stopPolling();
    }, [stopPolling]);

    const renderContent = () => {
        if (authLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            );
        }
        
        if (!user) {
            return <NotLoggedInCard />;
        }
        
        switch (pageState) {
            case 'loading':
                return <LoadingState status={status} />;
            case 'saved':
                return (
                    <SavedRecommendationsCard 
                        recommendations={results}
                        onDelete={handleDelete}
                        onRegenerate={handleRegenerate}
                    />
                );
            case 'results':
                return <ResultsDisplay results={results} onReset={handleRegenerate} />;
            case 'input':
            default:
                return (
                    <InputCard 
                        onGenerate={handleGenerate} 
                        isLoading={pageState === 'loading'} 
                        userProfile={userProfile} 
                    />
                );
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#121826] text-gray-200">
            <Navbar />
            <main className="flex-grow flex flex-col items-center justify-center relative overflow-hidden p-4 pt-24 pb-20">
                <FloatingElements />
                <LandingSections  scrollToExplore={scrollToExplore}/>
                <div ref={exploreRef}>
  <AnimatePresence mode="wait">
    <motion.div
        key={pageState}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="w-full z-10"
    >
        {renderContent()}
    </motion.div>
  </AnimatePresence>
</div>

            </main>
            <Footer />
        </div>
    );
}