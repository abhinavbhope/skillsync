'use client';

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, File, Code, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from "@/context/auth-context";
import { getRepoContents } from "@/lib/projectsApi";
import { cn } from "@/lib/utils";

const iconMap = {
    dir: Folder,
    file: File,
    default: Code,
};

const TreeItem = ({ item, level, owner, repo, keyComponents }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [children, setChildren] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    const isKeyComponent = keyComponents?.includes(item.name);

    const handleToggle = useCallback(async () => {
        setIsOpen(prev => !prev);
        if (item.type === 'dir' && !children && !isOpen) {
            setIsLoading(true);
            try {
                // This assumes a function `getRepoContents` exists in your API layer
                const contents = await getRepoContents(owner, repo, item.path, user?.id); // Pass userId for token
                setChildren(contents);
            } catch (error) {
                console.error("Failed to fetch repo contents:", error);
                setChildren([]); // Show empty on error
            } finally {
                setIsLoading(false);
            }
        }
    }, [item, children, isOpen, owner, repo, user]);

    return (
        <li className="my-1">
            <div 
                className={cn(
                    "flex items-center gap-2 p-1 rounded cursor-pointer hover:bg-white/10",
                    isKeyComponent && "bg-primary/20 text-primary-foreground badge-glow"
                )}
                onClick={handleToggle}
            >
                {item.type === 'dir' ? (
                    <ChevronRight className={cn("w-4 h-4 transition-transform", isOpen && "rotate-90")} />
                ) : <div className="w-4 h-4" />}
                
                {React.createElement(iconMap[item.type] || iconMap.default, { className: "w-4 h-4 shrink-0" })}
                <span>{item.name}</span>
            </div>

            <AnimatePresence>
                {isOpen && item.type === 'dir' && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pl-6"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2 text-gray-400 py-1"><Loader2 className="w-4 h-4 animate-spin" /> Fetching...</div>
                        ) : (
                            <ul>
                                {children?.map(child => (
                                    <TreeItem key={child.path} item={child} level={level + 1} owner={owner} repo={repo} keyComponents={keyComponents}/>
                                ))}
                                {children?.length === 0 && <li className="text-gray-500 text-xs py-1">No children found.</li>}
                            </ul>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </li>
    );
};

const RepoTree = ({ rawStructure = [], owner, repo, keyComponents = [] }) => {
    if (!rawStructure || rawStructure.length === 0) {
        return <p className="text-xs text-center text-gray-500 p-4">No repository structure available.</p>
    }
    return (
        <div className="bg-black/30 p-3 rounded-lg border border-white/10 max-h-60 overflow-y-auto">
            <ul className="text-sm text-gray-300 space-y-1">
                {rawStructure.map(item => (
                    <TreeItem 
                        key={item.path} 
                        item={item} 
                        level={0} 
                        owner={owner} 
                        repo={repo}
                        keyComponents={keyComponents}
                    />
                ))}
            </ul>
        </div>
    );
}

export default RepoTree;
