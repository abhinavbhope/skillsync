'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, File, Server, Book, Settings, Image as ImageIcon, TestTube, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Icon and Color Mapping ---
const iconMap = {
    folder: Folder,
    source: File,
    test: TestTube,
    config: Settings,
    doc: Book,
    build: Server,
    asset: ImageIcon,
    default: File,
};

const colorMap = {
    folder: 'text-amber-400',
    source: 'text-blue-400',
    test: 'text-orange-400',
    config: 'text-yellow-400',
    doc: 'text-green-400',
    build: 'text-purple-400',
    asset: 'text-pink-400',
    default: 'text-gray-400',
};

// --- Data Processing Functions ---
const getFileType = (path, structure) => {
    if (!structure) return 'default';
    if (structure.sourceDirectories?.includes(path)) return 'source';
    if (structure.testDirectories?.includes(path)) return 'test';
    if (structure.configFiles?.includes(path)) return 'config';
    if (structure.documentationFiles?.includes(path)) return 'doc';
    if (structure.buildFiles?.includes(path)) return 'build';
    if (structure.assetDirectories?.includes(path)) return 'asset';
    return 'default';
};

const buildFileTree = (structure) => {
    const tree = {};
    if (!structure) return tree;

    const allFilesAndDirs = new Set([
        ...(structure.sourceDirectories || []),
        ...(structure.testDirectories || []),
        ...(structure.configFiles || []),
        ...(structure.documentationFiles || []),
        ...(structure.buildFiles || []),
        ...(structure.assetDirectories || []),
    ]);

    allFilesAndDirs.forEach(path => {
        let currentLevel = tree;
        const parts = path.split('/');
        parts.forEach((part, index) => {
            if (!part) return;

            // If it's a file (last part)
            if (index === parts.length - 1 && path.includes('.')) { 
                 const fileType = getFileType(path, structure);
                 currentLevel[part] = { type: 'file', fileType: fileType, path: path };
            } else { // It's a directory
                if (!currentLevel[part]) {
                    currentLevel[part] = { type: 'folder', children: {}, path: parts.slice(0, index + 1).join('/') };
                }
                currentLevel = currentLevel[part].children;
            }
        });
    });

    return tree;
};


// --- Tree Rendering Components ---
const TreeItem = ({ name, item, level }) => {
    const [isOpen, setIsOpen] = useState(level < 1); // Auto-open first level

    if (item.type === 'folder') {
        const Icon = iconMap.folder;
        const color = colorMap.folder;
        return (
            <div>
                <div 
                    className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-white/5 cursor-pointer w-max"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <ChevronRight className={cn("w-4 h-4 transition-transform", isOpen && "rotate-90")} />
                    <Icon className={cn("w-4 h-4 shrink-0", color)} />
                    <span className="text-sm font-mono text-gray-300">{name}</span>
                </div>
                <AnimatePresence initial={false}>
                    {isOpen && (
                         <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden' }}
                        >
                            <FileTree tree={item.children} level={level + 1} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    const Icon = iconMap[item.fileType] || iconMap.default;
    const color = colorMap[item.fileType] || colorMap.default;

    return (
        <div className="pl-4">
            <div className="flex items-center gap-2 py-1.5 px-2 w-max">
                <div className="w-4 h-4 ml-2"></div> {/* Spacer to align with folder icon */}
                <Icon className={cn("w-4 h-4 shrink-0", color)} />
                <span className="text-sm font-mono text-gray-400">{name}</span>
            </div>
        </div>
    );
};

const FileTree = ({ tree, level = 0 }) => {
    const sortedKeys = useMemo(() => Object.keys(tree).sort((a, b) => {
        const itemA = tree[a];
        const itemB = tree[b];
        if (itemA.type === 'folder' && itemB.type !== 'folder') return -1;
        if (itemA.type !== 'folder' && itemB.type === 'folder') return 1;
        return a.localeCompare(b);
    }), [tree]);

    return (
        <div style={{ paddingLeft: `${level > 0 ? 1.25 : 0}rem` }}>
            {sortedKeys.map(key => (
                <TreeItem key={key} name={key} item={tree[key]} level={level} />
            ))}
        </div>
    );
};

// --- Main Component ---
const RepoTreeView = ({ repository }) => {
    const repositoryStructure = repository?.repositoryStructure;

    const fileTree = useMemo(() => {
        return buildFileTree(repositoryStructure);
    }, [repositoryStructure]);

    if (!repositoryStructure) {
        return <p className="text-gray-500 text-center p-4">No repository structure data available for analysis.</p>;
    }
    
    return (
        <motion.div 
            className="bg-gray-900/30 p-4 rounded-lg border border-gray-700/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div><span className="text-gray-400">Total Files:</span> <span className="text-white ml-2 font-mono">{repositoryStructure.totalFiles || 0}</span></div>
                    <div><span className="text-gray-400">Total Folders:</span> <span className="text-white ml-2 font-mono">{repositoryStructure.totalFolders || 0}</span></div>
                    <div><span className="text-gray-400">Architecture:</span> <span className="text-white ml-2">{repositoryStructure.primaryArchitecture || 'N/A'}</span></div>
                    <div><span className="text-gray-400">Quality Score:</span> <span className="text-white ml-2 font-bold">{repositoryStructure.structureQualityScore || 0}/100</span></div>
                </div>
            </div>

            <div className="max-h-[400px] overflow-auto pr-2">
                 <FileTree tree={fileTree} />
            </div>
        </motion.div>
    );
};

export default RepoTreeView;
