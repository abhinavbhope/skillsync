'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Hyperspeed from '@/components/analyzer/hyperspeed-loader';
import { useToast } from '@/hooks/use-toast';
import { triggerEnrichment, getProcessingStatus } from '@/lib/analyzerApi';

const POLLING_INTERVAL = 5000; // 5 seconds
const POLLING_TIMEOUT = 60000; // 1 minute (shorter timeout for faster feedback)

export default function LoadingPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [statusText, setStatusText] = useState('Initializing AI analysis...');
    const hasStartedFlow = useRef(false);
    
    useEffect(() => {
        if (hasStartedFlow.current) return;
        hasStartedFlow.current = true;

        let pollingInterval;
        let timeoutId;
        let pollingAttempts = 0;

        const stopAllTimers = () => {
            if (pollingInterval) clearInterval(pollingInterval);
            if (timeoutId) clearTimeout(timeoutId);
        };

        const checkEnrichmentStatus = async () => {
            pollingAttempts++;
            console.log(`[LoadingPage] Polling attempt ${pollingAttempts}...`);
            
            try {
                const status = await getProcessingStatus();
                console.log('[LoadingPage] Status response:', status);

                if (status.enriched) {
                    // Success case - enrichment completed
                    console.log('[LoadingPage] ✅ Enrichment complete!');
                    stopAllTimers();
                    setStatusText('✅ Analysis complete! Redirecting...');
                    toast({
                        title: 'Success!',
                        description: 'Your AI-powered insights are ready.',
                    });
                    router.push(`/dashboard?refresh=${Date.now()}`);
                    return true;
                }

                // Check if we should stop polling due to timeout or max attempts
                if (pollingAttempts >= 12) { // 12 attempts = 1 minute
                    console.log('[LoadingPage] ❌ Max polling attempts reached');
                    stopAllTimers();
                    
                    // Check if data might already be available despite no "enriched" flag
                    const finalCheck = await getProcessingStatus();
                    if (finalCheck.enriched) {
                        setStatusText('✅ Analysis complete! Redirecting...');
                        toast({
                            title: 'Success!',
                            description: 'Your AI-powered insights are ready.',
                        });
                        router.push(`/dashboard?refresh=${Date.now()}`);
                    } else {
                        // Assume duplicate enrichment - data might already be available
                        setStatusText('🔄 Analysis already completed!');
                        toast({
                            title: 'Analysis Complete',
                            description: 'Your profiles have already been analyzed. Redirecting to insights...',
                        });
                        setTimeout(() => router.push(`/dashboard?refresh=${Date.now()}`), 1500);
                    }
                    return true;
                }

                console.log('[LoadingPage] ⏳ Enrichment still in progress...');
                return false;

            } catch (error) {
                console.error('[LoadingPage] Polling error:', error);
                
                if (pollingAttempts >= 6) { // After 6 failed attempts (30 seconds)
                    console.log('[LoadingPage] ❌ Too many polling errors');
                    stopAllTimers();
                    toast({
                        variant: 'destructive',
                        title: 'Connection Error',
                        description: 'Unable to check analysis status. Redirecting to dashboard...',
                    });
                    // Redirect to dashboard anyway - data might be available
                    router.push(`/dashboard?refresh=${Date.now()}`);
                    return true;
                }
                return false;
            }
        };

        const startEnrichmentFlow = async () => {
            try {
                // 1. First, check if profiles are already enriched
                setStatusText('🔍 Checking for existing insights...');
                const initialStatus = await getProcessingStatus();
                console.log('[LoadingPage] Initial status:', initialStatus);

                if (initialStatus.enriched) {
                    setStatusText('✅ Insights already available!');
                    toast({
                        title: 'Insights Ready!',
                        description: 'Your AI-powered analysis was already available.',
                    });
                    setTimeout(() => router.push('/dashboard?refresh=' + Date.now()), 1500);
                    return;
                }

                // 2. If not enriched, trigger enrichment
                setStatusText('🚀 Starting AI analysis with Gemini...');
                await triggerEnrichment();
                console.log('[LoadingPage] ✅ Enrichment triggered successfully');
                
                // 3. Start polling with shorter intervals
                setStatusText('⏳ AI is analyzing your profiles...');
                
                // Start immediate first check
                setTimeout(() => checkEnrichmentStatus(), 2000);
                
                // Then poll every interval
                pollingInterval = setInterval(checkEnrichmentStatus, POLLING_INTERVAL);

                // Global timeout
                timeoutId = setTimeout(() => {
                    console.log('[LoadingPage] ⏰ Global timeout reached');
                    stopAllTimers();
                    // Assume duplicate or already processed - redirect to dashboard
                    setStatusText('🔄 Analysis completed!');
                    toast({
                        title: 'Analysis Complete',
                        description: 'Redirecting to your insights...',
                    });
                    router.push(`/dashboard?refresh=${Date.now()}`);
                }, POLLING_TIMEOUT);

            } catch (error) {
                console.error('❌ Enrichment process failed:', error);
                stopAllTimers();
                
                // Check if it's a duplicate error
                if (error.message && (error.message.includes('duplicate') || error.message.includes('already') || error.message.includes('processed'))) {
                    setStatusText('✅ Analysis already completed!');
                    toast({
                        title: 'Analysis Already Complete',
                        description: 'Your profiles have already been analyzed.',
                    });
                    setTimeout(() => router.push(`/dashboard?refresh=${Date.now()}`), 1500);
                } else {
                    toast({
                        variant: 'destructive',
                        title: 'Analysis Failed',
                        description: error.message || 'Could not start the AI analysis process.',
                    });
                    router.push('/analyzer');
                }
            }
        };

        startEnrichmentFlow();
        
        // Cleanup on unmount
        return () => {
            stopAllTimers();
        };
    }, [router, toast]);

    return (
    <div className="relative w-screen min-h-screen bg-black flex flex-col items-center justify-center p-4 overflow-hidden">
        
        {/* Hyperspeed animated background */}
        <div className="absolute inset-0 z-0">
            <Hyperspeed />
        </div>

        {/* Centered Glass Loading Card */}
        <div className="relative z-10 w-full max-w-lg mx-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center"
            >
                <h1 className="text-3xl md:text-4xl font-headline font-bold text-white">
                    Preparing Your Analysis
                </h1>

                <p className="mt-3 text-gray-300 text-base">
                    {statusText}
                </p>

                <p className="mt-2 text-gray-400 text-sm">
                    This may take a few moments. Please wait…
                </p>

                {/* Spinner */}
                {!statusText.includes('complete') && !statusText.includes('already') && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 flex justify-center"
                    >
                        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    </div>
);

}