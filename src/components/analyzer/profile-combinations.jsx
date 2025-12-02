'use client';
import { useState, useEffect, useCallback } from 'react';
import { getProfileCombinations } from '@/lib/analyzerApi';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import CreateProfileForm from './create-profile-form';
import ProfileCard from './profile-card';

const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const ProfileCombinations = ({ user, onTriggerEnrichment, leetcodeData }) => {
    const [combinations, setCombinations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchCombinations = useCallback(async () => {
        try {
            const data = await getProfileCombinations();
            setCombinations(data || []);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not fetch profile combinations.',
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
    if (user) {
        fetchCombinations();
    } else {
        setIsLoading(false);
        setCombinations([]); // no saved profiles for guests
    }
}, [user, fetchCombinations]);


    const handleProfileCreated = (newProfile) => {
        setCombinations(prev => [{ ...newProfile, isNew: true }, ...prev]);
    };
    
    const handleProfileDeleted = (combinationId) => {
        setCombinations(prev => prev.filter(p => p.combinationId !== combinationId));
    };
    
    const handleProfileUpdated = (updatedProfile, isPrimaryUpdate = false) => {
        setCombinations(prev => {
            let newCombinations = [...prev];
            if (isPrimaryUpdate) {
                newCombinations = newCombinations.map(p => ({ ...p, primary: false }));
            }
            const index = newCombinations.findIndex(p => p.combinationId === updatedProfile.combinationId);
            if (index !== -1) {
                newCombinations[index] = { ...newCombinations[index], ...updatedProfile, isNew: false };
            }
            newCombinations.sort((a, b) => (b.primary ? 1 : 0) - (a.primary ? 1 : 0));
            return newCombinations;
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div className="space-y-8 w-full">
            <CreateProfileForm onProfileCreated={handleProfileCreated} disabled={combinations.length >= 5} user={user} 
    forceLogin={!user}/>
            
            {user && combinations.length > 0 && (
                <div className="space-y-4 w-full">
                    <h2 className="text-2xl font-headline font-bold text-left text-white mt-12 mb-6">Your Analyzed Profiles</h2>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col gap-6 w-full"
                    >
                        <AnimatePresence>
                            {combinations.map(profile => (
                                <motion.div
                                    key={profile.combinationId}
                                    variants={{ 
                                        hidden: { opacity: 0, y: 20 }, 
                                        visible: { opacity: 1, y: 0 } 
                                    }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    layout
                                    className="w-full"
                                >
                                    <ProfileCard
                                        profile={profile}
                                        onDeleted={handleProfileDeleted}
                                        onUpdated={handleProfileUpdated}
                                        onTriggerEnrichment={onTriggerEnrichment}
                                        isNew={profile.isNew || false}
                                        leetcodeData={leetcodeData}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ProfileCombinations;