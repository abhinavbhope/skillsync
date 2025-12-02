'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/auth-context';
import { getSavedProjects } from '@/lib/projectsApi';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FolderGit2, AlertTriangle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';

const SavedProjectsSidebar = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [savedProjects, setSavedProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSaved = useCallback(async () => {
        if (!user) {
            setIsLoading(false);
            return;
        };
        setIsLoading(true);
        setError(null);
        try {
            const projects = await getSavedProjects(user.id);
            setSavedProjects(projects);
        } catch (err) {
            setError(err.message || 'Failed to fetch saved projects.');
            toast({
                variant: 'destructive',
                title: 'Error',
                description: err.message || 'Could not fetch your saved projects.'
            });
        } finally {
            setIsLoading(false);
        }
    }, [user, toast]);

    useEffect(() => {
        fetchSaved();
    }, [fetchSaved]);

    return (
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-4 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <FolderGit2 className="mr-2" />
                Saved Projects
            </h3>
            <ScrollArea className="flex-grow">
                {isLoading && (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                )}
                {!isLoading && error && (
                    <div className="text-center text-red-400 p-4">
                        <AlertTriangle className="mx-auto mb-2" />
                        <p className="text-sm">{error}</p>
                        <button onClick={fetchSaved} className="text-xs mt-2 underline">Retry</button>
                    </div>
                )}
                {!isLoading && !error && savedProjects.length === 0 && (
                    <div className="text-center text-gray-500 p-4">
                        <p className="text-sm">No projects saved yet.</p>
                        <Link href="/open-source" className="text-sm text-primary hover:underline mt-2 inline-block">
                            Find projects to save
                        </Link>
                    </div>
                )}
                {!isLoading && !error && savedProjects.length > 0 && (
                    <ul className="space-y-3 pr-2">
                        {savedProjects.map(p => (
                            <li key={p.projectUrl}>
                                <a 
                                    href={p.projectUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block p-3 rounded-lg bg-black/20 hover:bg-primary/20 transition-colors group"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-white truncate">{p.projectName}</p>
                                            <p className="text-xs text-gray-400">{p.owner}</p>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors shrink-0"/>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </ScrollArea>
        </div>
    );
};

export default SavedProjectsSidebar;
