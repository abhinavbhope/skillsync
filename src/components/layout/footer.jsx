import React from 'react';
import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] text-gray-400">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-headline font-bold text-white">SkillSync</h3>
            <p className="text-sm mt-1">Your Skills Are Your Resume.</p>
            <p>Abhinav Bhope</p>
          </div>
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link href="#" className="hover:text-primary transition-colors"><Github size={20} /></Link>
            <Link href="#" className="hover:text-primary transition-colors"><Twitter size={20} /></Link>
            <Link href="#" className="hover:text-primary transition-colors"><Linkedin size={20} /></Link>
          </div>
          <div className="text-sm">
            &copy; {new Date().getFullYear()} SkillSync. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
