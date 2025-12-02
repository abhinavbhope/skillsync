'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { createProfileCombination } from '@/lib/analyzerApi';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const formSchema = z.object({
    profileName: z.string().min(3, { message: 'Profile name must be at least 3 characters.' }),
    githubUsername: z.string().min(1, { message: 'GitHub username is required.' }),
    leetcodeUsername: z.string().min(1, { message: 'LeetCode username is required.' }),
    makePrimary: z.boolean().default(false),
});

const CreateProfileForm = ({ onProfileCreated, disabled, user, forceLogin }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            profileName: '',
            githubUsername: '',
            leetcodeUsername: '',
            makePrimary: true,
        },
    });

    const onSubmit = async (values) => {
        setIsSubmitting(true);
        if (!user || forceLogin) {
        toast({
            title: "Login Required",
            description: "Please login to create and analyze profiles.",
            variant: "destructive"
        });
        return;
    }
        try {
            const newProfile = await createProfileCombination(values);
            toast({
                title: 'Profile Created',
                description: `Analysis for "${values.profileName}" has started.`,
            });
            onProfileCreated(newProfile);
            form.reset();
            setIsFormVisible(false);
        } catch (error) {
            if (error.status === 409) { // 409 Conflict for duplicate
                const isEnriched = error.message?.includes('Previously Enriched: Yes');
                toast({
                    variant: 'destructive',
                    title: 'Duplicate Profile',
                    description: error.message,
                    action: isEnriched ? (
                        <Button 
                            variant="secondary" 
                            className="mt-2 bg-slate-700 hover:bg-slate-600"
                            onClick={() => router.push('/dashboard')}>
                            Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : null,
                    duration: 10000,
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Creation Failed',
                    description: error.message || 'An unknown error occurred.',
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isFormVisible) {
        return (
            <div className="flex justify-center">
                <Button
    onClick={() => {
        if (!user || forceLogin) {
            toast({
                title: "Login Required",
                description: "Please login to create and analyze profiles.",
                variant: "destructive"
            });
            return;
        }
        setIsFormVisible(true);
    }}
    disabled={false} // do NOT disable—allow click to show toast
                        className="group bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105 text-lg px-8 py-6 rounded-full"

>
    <PlusCircle className="mr-2" />
    Create New Profile
</Button>

                {disabled && <p className="text-sm text-yellow-500 mt-2">You have reached the maximum number of profiles.</p>}
            </div>
        );
    }
    
    return (
        <motion.div
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
        >
            <Card className="bg-card/60 border-white/10 backdrop-blur-sm shadow-xl w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Create New Profile Combination</CardTitle>
                    <CardDescription>Enter the details below to start the analysis.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="profileName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Profile Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 'My Main Profile'" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="githubUsername"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>GitHub Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., 'octocat'" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="leetcodeUsername"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>LeetCode Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., 'coder123'" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="makePrimary"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-black/20">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Make this my primary profile</FormLabel>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="ghost" onClick={() => setIsFormVisible(false)} disabled={isSubmitting}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create and Analyze
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default CreateProfileForm;
