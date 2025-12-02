'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Github, Code } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

const GlassmorphicCard = ({ children, className }) => (
    <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg ${className}`}>
        {children}
    </div>
);

const StatusItem = ({ icon, platform, username, lastSynced, enriched }) => {
    const isConnected = !!username;

    return (
        <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
            <div className="flex items-center gap-4">
                {icon}
                <div>
                    <p className="font-bold text-white">{platform}</p>
                    <p className="text-sm text-gray-400">{isConnected ? username : 'Not Connected'}</p>
                </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
                {isConnected && (
                    <div className="text-right">
                        <p className="text-gray-300">Last Synced</p>
                        <p className="text-gray-500">{lastSynced ? formatDistanceToNow(parseISO(lastSynced), { addSuffix: true }) : 'N/A'}</p>
                    </div>
                )}
                {enriched ? 
                    <CheckCircle className="w-6 h-6 text-green-500" /> :
                    <XCircle className="w-6 h-6 text-red-500" />
                }
            </div>
        </div>
    )
};


const PlatformStatus = ({ status }) => {
    if (!status) return null;

    return (
        <GlassmorphicCard>
            <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StatusItem
                        icon={<Github className="w-8 h-8 text-white"/>}
                        platform="GitHub"
                        username={status.githubUsername}
                        lastSynced={status.githubLastSynced}
                        enriched={status.githubEnriched}
                    />
                     <StatusItem
                        icon={<Code className="w-8 h-8 text-white"/>}
                        platform="LeetCode"
                        username={status.leetcodeUsername}
                        lastSynced={status.leetcodeLastSynced}
                        enriched={status.leetcodeEnriched}
                    />
                </div>
            </CardContent>
        </GlassmorphicCard>
    );
};

export default PlatformStatus;
