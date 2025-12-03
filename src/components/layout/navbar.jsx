"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Login from "@/components/auth/login";
import { Rocket, Menu, X } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";

const Logo = () => (
  <Link
    href="/"
    className="flex items-center gap-2 text-xl sm:text-2xl font-headline font-bold tracking-wider"
  >
    <Rocket className="text-primary animate-pulse" />
    <div className="hidden sm:block">
      Skill<span className="text-primary">Sync</span>
    </div>
  </Link>
);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-white/10"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Left: Logo */}
        <Logo />

        {/* Center: Desktop Links */}
        <div className="hidden md:flex gap-6">
          <Link
            href="/analyzer"
            className="text-sm font-semibold text-gray-300 hover:text-primary transition-colors relative group"
          >
            Profile Analyzer
            <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            href="/open-source"
            className="text-sm font-semibold text-gray-300 hover:text-primary transition-colors relative group"
          >
            Project Finder
            <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

        {/* Right: Desktop Auth */}
        <div className="hidden md:flex items-center space-x-4">
          {user && (
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-gray-300 hover:text-primary transition-colors relative group"
            >
              Dashboard
              <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          )}

          {loading ? <Skeleton className="h-10 w-10 rounded-full" /> : <Login />}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-300"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-t border-white/10 px-6 py-4 space-y-4">
          <Link
            href="/analyzer"
            onClick={() => setMenuOpen(false)}
            className="block text-sm font-semibold text-gray-300 hover:text-primary"
          >
            Profile Analyzer
          </Link>

          <Link
            href="/open-source"
            onClick={() => setMenuOpen(false)}
            className="block text-sm font-semibold text-gray-300 hover:text-primary"
          >
            Project Finder
          </Link>

          {user && (
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-semibold text-gray-300 hover:text-primary"
            >
              Dashboard
            </Link>
          )}

          <div className="pt-2">
            {loading ? (
              <Skeleton className="h-10 w-10 rounded-full" />
            ) : (
              <Login />
            )}
          </div>
        </div>
      )}
    </header>
  );
}
