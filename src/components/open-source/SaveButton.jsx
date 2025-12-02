'use client';

import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SaveButton = ({ isSaved, isSaving, onClick }) => {
    const Icon = isSaved ? BookmarkCheck : Bookmark;
    const text = isSaved ? 'Saved' : 'Save';

    return (
        <Button
            variant={isSaved ? "secondary" : "outline"}
            size="sm"
            onClick={onClick}
            disabled={isSaving}
            className={`transition-all duration-300 w-24 ${isSaved ? 'bg-primary/80 text-primary-foreground' : ''}`}
        >
            {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <>
                    <Icon className="h-4 w-4 mr-2" />
                    {text}
                </>
            )}
        </Button>
    );
};

export default SaveButton;
