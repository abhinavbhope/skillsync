"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Zap, Github, BarChart3, Brain } from 'lucide-react';

const SkillGraphSection = () => {
  const router = useRouter();
  const [userSkills, setUserSkills] = React.useState('');

  const features = [
    {
      icon: <Github className="h-8 w-8 text-primary" />,
      title: "Get Instant Open Source Project Recommendations",
      description: "Our AI matches your skills with perfect open-source projects where you can start contributing immediately.",
      image: "/images/oss-recommendations.jpg",
      path: "http://localhost:9002/open-source", // Will open in same page
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "Analyze Your GitHub and LeetCode Stats",
      description: "Get detailed insights from your coding activity and problem-solving patterns across platforms.",
      image: "/images/stats-analysis.jpg",
      path: "/analyzer", // Internal route
    },
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "Get In-Depth Insights With Our AI",
      description: "Advanced AI analysis identifies your strengths and growth opportunities in the developer landscape.",
      image: "/images/ai-insights.jpg",
      path: "/analyzer", // Internal route
    }
  ];

  const handleFeatureClick = (feature) => {
    // For external URLs (starting with http), use window.location
    if (feature.path.startsWith('http')) {
      window.location.href = feature.path; // Opens in same tab
    } else {
      // For internal routes, use Next.js router
      router.push(feature.path);
    }
  };

  const handleGetRecommendations = () => {
    if (userSkills.trim()) {
      // Redirect to analyzer page with skills as query parameter
      router.push(`/analyzer?skills=${encodeURIComponent(userSkills)}`);
    } else {
      // If no skills entered, just go to analyzer
      router.push('/analyzer');
    }
  };

  return (
    <section id="features" className="py-16 sm:py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold text-white">
            Your Developer Journey, Visualized
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-400 px-4">
            Discover your unique developer profile and get personalized recommendations for growth
          </p>
        </div>
        
        <Card className="bg-[#1a1a1a]/80 border-white/10 backdrop-blur-sm">
          <div className="p-6 sm:p-8 lg:p-10">
            <CardHeader className="p-0 mb-8">
              <CardTitle className="text-2xl sm:text-3xl font-headline text-white text-center">
                Powerful Developer Analytics
              </CardTitle>
              <CardDescription className="text-gray-400 text-center mt-2 max-w-2xl mx-auto">
                Three powerful ways to understand and grow your developer career
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-0">
              {/* Feature Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="bg-black/30 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300 group"
                  >
                    {/* Image Container */}
                    <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="p-4 bg-black/40 rounded-full backdrop-blur-sm">
                          {feature.icon}
                        </div>
                      </div>
                      {/* Placeholder for actual images */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                        <div className="w-full h-full bg-gradient-to-br from-primary to-purple-600" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 text-sm sm:text-base">
                        {feature.description}
                      </p>
                      
                      {/* Call to Action Button */}
                      <Button 
                        variant="outline" 
                        className="w-full mt-6 border-white/20 hover:border-primary hover:bg-primary/10"
                        onClick={() => handleFeatureClick(feature)}
                      >
                        <Zap className="mr-2 h-4 w-4" />
                        {feature.path.startsWith('http') ? "Explore Open Source" : "Analyze Now"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Optional: Input Section for user skills */}
              
            </CardContent>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default SkillGraphSection;