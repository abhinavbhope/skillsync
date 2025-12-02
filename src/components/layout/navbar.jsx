"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Login from '@/components/auth/login';
import { Rocket } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';

const Logo = () => (
  <Link href="/" className="flex items-center gap-2 text-2xl font-headline font-bold tracking-wider">
    <Rocket className="text-primary animate-pulse" />
    <div className="hidden sm:block">
      Skill<span className="text-primary">Sync</span>
    </div>
  </Link>
);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-white/10" : "bg-transparent"
    )}>
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex-1 flex justify-start">
          <Logo />
        </div>
        
        <div className="flex-1 flex justify-center items-center gap-6">
          <Link href="/analyzer" className="text-sm font-semibold text-gray-300 hover:text-primary transition-colors relative group">
              Profile Analyzer
              <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
           <Link href="/open-source" className="text-sm font-semibold text-gray-300 hover:text-primary transition-colors relative group">
              Project Finder
              <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

        <div className="flex-1 flex justify-end items-center space-x-4">
           {user && (
            <Link href="/dashboard" className="text-sm font-semibold text-gray-300 hover:text-primary transition-colors relative group">
                Dashboard
                <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
           )}
           {loading ? (
             <Skeleton className="h-10 w-10 rounded-full" />
           ) : (
             <Login />
           )}
        </div>
      </nav>
    </header>
  );
}
