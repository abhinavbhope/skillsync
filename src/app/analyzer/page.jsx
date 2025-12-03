'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ProfileCombinations from '@/components/analyzer/profile-combinations';
import { Loader2, ArrowRight, Code, BarChart, Brain, Zap, Sparkles, Target } from 'lucide-react';
import FloatingElements from '@/components/dashboard/FloatingElements';
import HyperspeedLoader from '@/components/analyzer/hyperspeed-loader';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AnalyzerPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [isNavigatingToLoading, setIsNavigatingToLoading] = useState(false);

    const handleTriggerEnrichment = async () => {
        setIsNavigatingToLoading(true);
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push('/analyzer/loading');
    };

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const cardItems = [
        {
            id: 1,
            title: "Comprehensive GitHub Analysis",
            description: "Deep dive into your repositories, contributions, languages, and collaboration patterns. Understand your coding habits and project impact.",
            icon: <Code className="h-10 w-10" />,
            image: "/github.png",
            bgColor: "from-purple-900/30 to-primary/20",
            delay: 0.1
        },
        {
            id: 2,
            title: "Advanced LeetCode Insights",
            description: "Track your problem-solving journey with detailed stats on solved problems, difficulty distribution, and algorithm mastery progression.",
            icon: <BarChart className="h-10 w-10" />,
            image: "/images/leetcode-insights.svg",
            bgColor: "from-blue-900/30 to-cyan-500/20",
            delay: 0.2
        },
        {
            id: 3,
            title: "AI-Powered Developer Profile",
            description: "Get personalized recommendations, skill gap analysis, and growth paths tailored to your unique coding journey and career goals.",
            icon: <Brain className="h-10 w-10" />,
            image: "/images/ai-profile.svg",
            bgColor: "from-green-900/30 to-emerald-500/20",
            delay: 0.3
        }
    ];

    // Show hyperspeed loader when navigating
    if (isNavigatingToLoading) {
        return <HyperspeedLoader />;
    }

    // While auth state loads
    if (authLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#121826] text-gray-200">
                <Navbar />
                <main className="flex-grow flex items-center justify-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#121826] text-gray-200">
            <Navbar />

            <main className="flex-grow relative overflow-hidden">
                {/* Hero Section with Framer Motion */}
                <section className="relative pt-28 pb-20 overflow-hidden">
                    <FloatingElements />
                    
                    {/* Animated background elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div 
                            className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
                            animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3]
                            }}
                            transition={{ 
                                duration: 4, 
                                repeat: Infinity,
                                repeatType: "reverse" 
                            }}
                        />
                        <motion.div 
                            className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
                            animate={{ 
                                scale: [1.2, 1, 1.2],
                                opacity: [0.5, 0.3, 0.5]
                            }}
                            transition={{ 
                                duration: 5, 
                                repeat: Infinity,
                                repeatType: "reverse",
                                delay: 1 
                            }}
                        />
                    </div>

                    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div 
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="text-center"
                        >
                            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm mb-6">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium text-primary">AI-Powered Analysis</span>
                            </motion.div>
                            
                            <motion.h1 
                                variants={fadeInUp}
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold text-white mb-6"
                            >
                                Uncover Your
                                <span className="block mt-2">
                                    <span className="relative">
                                        <span className="relative z-10 bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
                                            Developer DNA
                                        </span>
                                        <motion.div 
                                            className="absolute inset-0 bg-primary/20 blur-xl"
                                            animate={{ opacity: [0.2, 0.4, 0.2] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </span>
                                </span>
                            </motion.h1>
                            
                            <motion.p 
                                variants={fadeInUp}
                                className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10"
                            >
                                Combine GitHub & LeetCode insights to reveal your unique coding patterns, 
                                strengths, and growth opportunities with AI-powered analysis.
                            </motion.p>
                            
                            <motion.div 
                                variants={fadeInUp}
                                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                            >
                                <button 
                                    onClick={() => document.getElementById('profile-section').scrollIntoView({ behavior: 'smooth' })}
                                    className="px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl flex items-center gap-2 transition-all duration-300 hover:scale-105"
                                >
                                    Start Analysis <ArrowRight className="h-5 w-5" />
                                </button>
                                <button 
                                    onClick={() => router.push('/features')}
                                    className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 font-semibold rounded-xl flex items-center gap-2 transition-all duration-300"
                                >
                                    <Zap className="h-5 w-5" /> See Features
                                </button>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Three Alternating Card Sections */}
                <section className="py-20 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a] to-transparent" />
                    
                    {cardItems.map((item, index) => (
                        <div key={item.id} className={`relative ${index > 0 ? 'mt-32' : ''}`}>
                            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <motion.div 
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-100px" }}
                                    variants={staggerContainer}
                                    className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}
                                >
                                    {/* Content Side */}
                                    <motion.div 
                                        variants={fadeInUp}
                                        className={`flex-1 ${index % 2 === 0 ? 'lg:text-left' : 'lg:text-right'}`}
                                    >
                                        <div className={`inline-flex items-center gap-3 p-3 rounded-2xl ${item.bgColor} backdrop-blur-sm mb-6 ${index % 2 === 0 ? 'lg:justify-start' : 'lg:ml-auto'}`}>
                                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Target className="h-4 w-4 text-primary" />
                                                    <span className="text-sm font-semibold text-gray-300">Feature {item.id}</span>
                                                </div>
                                                <h3 className="text-2xl md:text-3xl font-headline font-bold text-white mt-2">
                                                    {item.title}
                                                </h3>
                                            </div>
                                        </div>
                                        
                                        <p className="text-lg text-gray-400 leading-relaxed">
                                            {item.description}
                                        </p>
                                        
                                        <div className="mt-8">
                                            <ul className="space-y-3">
                                                {[1, 2, 3].map((i) => (
                                                    <li key={i} className={`flex items-center gap-3 ${index % 2 === 0 ? '' : 'lg:justify-end'}`}>
                                                        {index % 2 === 0 && <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />}
                                                        <span className="text-gray-300">Advanced analytics dashboard</span>
                                                        {index % 2 !== 0 && <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>
                                    
                                    {/* Card/Image Side */}
                                    <motion.div 
                                        variants={fadeInUp}
                                        className="flex-1 relative"
                                    >
                                        <div className={`relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br ${item.bgColor} p-8 backdrop-blur-sm`}>
                                            {/* Card Background Pattern */}
                                            <div className="absolute inset-0 opacity-10">
                                                <div className="absolute top-0 left-0 w-32 h-32 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2" />
                                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500 rounded-full translate-x-1/2 translate-y-1/2" />
                                            </div>
                                            
                                            {/* Card Content */}
                                            <div className="relative z-10">
                                                <div className="aspect-video bg-black/30 rounded-xl border border-white/10 flex items-center justify-center">
                                                    <div className="text-center p-8">
                                                        <div className="text-5xl font-bold text-white mb-4">
                                                            {item.id === 1 ? "1000+" : item.id === 2 ? "500+" : "AI"}
                                                        </div>
                                                        <div className="text-gray-400">
                                                            {item.id === 1 ? "Repositories Analyzed" : item.id === 2 ? "Problems Solved" : "Powered Insights"}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-6 grid grid-cols-2 gap-4">
                                                    {["Advanced Metrics", "Real-time Updates", "Export Data", "Share Reports"].map((text, i) => (
                                                        <div key={i} className="bg-black/30 rounded-lg p-3 text-center border border-white/5">
                                                            <div className="text-xs text-gray-400">{text}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Floating Element */}
                                        <motion.div 
                                            className={`absolute ${index % 2 === 0 ? '-top-6 -right-6' : '-top-6 -left-6'} w-24 h-24 bg-primary/20 rounded-2xl border border-primary/30 backdrop-blur-sm flex items-center justify-center`}
                                            animate={{ 
                                                y: [0, -10, 0],
                                                rotate: index % 2 === 0 ? [0, 5, 0] : [0, -5, 0]
                                            }}
                                            transition={{ 
                                                duration: 3, 
                                                repeat: Infinity,
                                                repeatType: "reverse" 
                                            }}
                                        >
                                            <Zap className="h-8 w-8 text-primary" />
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Existing Profile Combinations Section */}
                <section id="profile-section" className="relative py-20">
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                        <div className="text-center mb-12">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm mb-4"
                            >
                                <Sparkles className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium text-primary">Ready to Begin</span>
                            </motion.div>
                            
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-5xl font-headline font-bold text-white"
                            >
                                Profile <span className="text-primary">Analyzer</span>
                            </motion.h2>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto"
                            >
                                {user
                                    ? "Create and manage your combined GitHub and LeetCode profiles. Get in-depth analysis and insights powered by AI."
                                    : "Analyze GitHub & LeetCode stats instantly. Login to save your combinations and access enriched profiles."}
                            </motion.p>

                            {/* Professional note */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="mt-6 text-sm text-gray-400 max-w-3xl mx-auto bg-white/5 border border-white/10 px-5 py-4 rounded-xl backdrop-blur-md"
                            >
                                <p className="mb-1">
                                    <span className="font-semibold text-gray-300">Note:</span> You can create up to 
                                    <span className="text-primary font-semibold"> 5 profile combinations</span>.
                                </p>
                                <p>
                                    Re-running AI-powered insights will 
                                    <span className="text-primary font-semibold"> overwrite previous analysis results </span> 
                                    for the selected profile.
                                </p>
                            </motion.div>
                        </div>

                        {/* Non-logged user: only show form input section */}
                        {!user && (
                            <ProfileCombinations
                                user={null}
                                allowOnlyForm
                                onTriggerEnrichment={handleTriggerEnrichment}
                            />
                        )}

                        {/* Logged-in user: show full component */}
                        {user && (
                            <ProfileCombinations
                                user={user}
                                onTriggerEnrichment={handleTriggerEnrichment}
                            />
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}