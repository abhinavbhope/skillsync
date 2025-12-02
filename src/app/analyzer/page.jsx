'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ProfileCombinations from '@/components/analyzer/profile-combinations';
import { Loader2 } from 'lucide-react';
import FloatingElements from '@/components/dashboard/FloatingElements';
import HyperspeedLoader from '@/components/analyzer/hyperspeed-loader';

export default function AnalyzerPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [isNavigatingToLoading, setIsNavigatingToLoading] = useState(false);

    const handleTriggerEnrichment = async () => {
        setIsNavigatingToLoading(true);
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push('/analyzer/loading');
    };

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

            <main className="flex-grow flex flex-col items-center justify-start relative overflow-hidden pt-28 pb-20">
                <FloatingElements />

                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-headline font-bold text-white">
                            Profile <span className="text-primary">Analyzer</span>
                        </h1>
                        <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
                            {user
                                ? "Create and manage your combined GitHub and LeetCode profiles. Get in-depth analysis and insights powered by AI."
                                : "Analyze GitHub & LeetCode stats instantly. Login to save your combinations and access enriched profiles."}
                        </p>

                        {/* Professional note */}
                        <div className="mt-6 text-sm text-gray-400 max-w-3xl mx-auto bg-white/5 border border-white/10 px-5 py-4 rounded-xl backdrop-blur-md">
                            <p className="mb-1">
                                <span className="font-semibold text-gray-300">Note:</span> You can create up to 
                                <span className="text-primary font-semibold"> 5 profile combinations</span>.
                            </p>
                            <p>
                                Re-running AI-powered insights will 
                                <span className="text-primary font-semibold"> overwrite previous analysis results </span> 
                                for the selected profile.
                            </p>
                        </div>
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
            </main>

            <Footer />
        </div>
    );
}
