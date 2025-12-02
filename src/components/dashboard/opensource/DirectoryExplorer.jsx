'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, File, ChevronRight, ChevronsUpDown, Search, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const GlassCard = ({ children, className }) => (
  <div className={`bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg p-4 ${className}`}>
    {children}
  </div>
);

const treeVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
};

const TreeItem = ({ item, level = 0, searchQuery = '' }) => {
    const [isOpen, setIsOpen] = useState(level < 2);
    const isDir = item.type === 'dir' || item.children?.length > 0;
    
    const shouldHighlight = searchQuery && item.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return (
        <div style={{ paddingLeft: `${level * 20}px`}}>
            <div 
                className={cn(
                    "flex items-center gap-2 py-2 px-3 rounded-md hover:bg-white/5 cursor-pointer transition-colors",
                    item.isKeyComponent ? 'text-cyan-300 bg-cyan-500/10' : 'text-gray-300',
                    shouldHighlight && 'bg-yellow-500/20 text-yellow-300'
                )}
                onClick={() => isDir && setIsOpen(!isOpen)}
            >
                {isDir ? (
                    <ChevronRight className={cn("w-3.5 h-3.5 transition-transform flex-shrink-0", isOpen && "rotate-90")} />
                ) : (
                    <div className="w-3.5 h-3.5 flex-shrink-0" />
                )}
                {isDir ? (
                    <Folder className={cn("w-4 h-4 flex-shrink-0", isOpen ? "text-amber-300" : "text-amber-400/70")}/>
                ) : (
                    <File className="w-4 h-4 flex-shrink-0 text-blue-400/70"/>
                )}
                <span className={cn(
                    "text-sm font-mono truncate",
                    shouldHighlight && "font-semibold"
                )}>
                    {item.name}
                </span>
                {isDir && item.children && (
                    <span className="ml-auto text-xs text-gray-500">
                        {item.children.length} item{item.children.length !== 1 ? 's' : ''}
                    </span>
                )}
            </div>
             <AnimatePresence>
                {isOpen && isDir && item.children && (
                     <motion.div variants={treeVariants} initial="collapsed" animate="expanded" exit="collapsed">
                        {item.children.map(child => (
                            <TreeItem 
                                key={child.path} 
                                item={child} 
                                level={level + 1} 
                                searchQuery={searchQuery}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function DirectoryExplorer({ project }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const treeData = useMemo(() => {
        if (!project?.rawStructure) {
            console.log('No rawStructure found for project:', project?.projectName);
            return [];
        }
        
        console.log('Building tree for project:', project.projectName, 'with', project.rawStructure.length, 'items');
        
        const keyComponents = project.keyComponents || project.keyComponentsAI || [];
        const tree = {};
        const allNodes = {};

        project.rawStructure.forEach(item => {
            const node = { 
                ...item, 
                children: [], 
                isKeyComponent: keyComponents.includes(item.name) || keyComponents.some(kc => 
                    item.path.includes(kc) || kc.includes(item.name)
                )
            };
            allNodes[item.path] = node;
            
            const parts = item.path.split('/');
            if (parts.length === 1) {
                tree[item.path] = node;
            } else {
                const parentPath = parts.slice(0, -1).join('/');
                if (allNodes[parentPath]) {
                    allNodes[parentPath].children.push(node);
                    allNodes[parentPath].type = 'dir';
                } else {
                    const parentNode = { 
                        name: parts[parts.length - 2], 
                        path: parentPath, 
                        type: 'dir', 
                        children: [node],
                        isKeyComponent: keyComponents.some(kc => parentPath.includes(kc))
                    };
                    allNodes[parentPath] = parentNode;
                    
                    const grandParentPath = parts.slice(0, -2).join('/');
                    if (grandParentPath && allNodes[grandParentPath]) {
                        allNodes[grandParentPath].children.push(parentNode);
                    } else {
                        tree[parentPath] = parentNode;
                    }
                }
            }
        });
        
        const result = Object.values(tree);
        console.log('Tree result:', result.length, 'root nodes');
        return result;
    }, [project]);

    const filteredTreeData = useMemo(() => {
        if (!searchQuery) return treeData;
        
        const filterNodes = (nodes) => {
            return nodes.filter(node => {
                if (node.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                    return true;
                }
                if (node.children && node.children.length > 0) {
                    node.children = filterNodes(node.children);
                    return node.children.length > 0;
                }
                return false;
            });
        };
        
        return filterNodes([...treeData]);
    }, [treeData, searchQuery]);

    if (!project) {
        console.log('DirectoryExplorer: No project provided');
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8">
                <FolderOpen className="w-16 h-16 mb-4 opacity-50" />
                <p>No project selected</p>
            </div>
        );
    }

    if (!project.rawStructure || project.rawStructure.length === 0) {
        console.log('DirectoryExplorer: No rawStructure data for project', project.projectName);
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8">
                <FolderOpen className="w-16 h-16 mb-4 opacity-50" />
                <p>No directory structure available for this project</p>
            </div>
        );
    }

    const totalItems = project.rawStructure?.length || 0;
    const directories = project.rawStructure?.filter(item => item.type === 'dir').length || 0;
    const files = totalItems - directories;

    return (
        <div className="h-full flex flex-col">
            {/* Header with stats and controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white">Directory Structure</h3>
                    <p className="text-sm text-gray-400">
                        {totalItems} items ({directories} folders, {files} files)
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative flex-1 sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            type="search"
                            placeholder="Search files..."
                            className="pl-9 bg-black/30 border-white/10 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex-shrink-0"
                    >
                        <ChevronsUpDown className="w-4 h-4"/>
                    </Button>
                </div>
            </div>

            {/* Directory Tree */}
            <div className="flex-grow overflow-y-auto pr-2 bg-black/20 rounded-lg p-3 border border-white/10">
                {filteredTreeData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                        <Search className="w-8 h-8 mb-2" />
                        <p>No files or folders found</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-1"
                        >
                            {filteredTreeData.map(node => (
                                <TreeItem 
                                    key={node.path} 
                                    item={node} 
                                    searchQuery={searchQuery}
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>

            {/* Footer with key */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10 text-xs text-gray-500">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-cyan-500/20 border border-cyan-500/50 rounded" />
                        <span>Key Component</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-yellow-500/20 border border-yellow-500/50 rounded" />
                        <span>Search Match</span>
                    </div>
                </div>
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery('')}
                        className="text-primary hover:text-primary/80 text-xs"
                    >
                        Clear search
                    </button>
                )}
            </div>
        </div>
    );
}