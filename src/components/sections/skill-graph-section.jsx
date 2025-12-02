"use client";

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Zap } from 'lucide-react';
import SkillGraph from '@/components/ui/skill-graph';
import { analyzeSkills } from '@/ai/flows/analyze-skills-with-ai';

const sampleProfiles = {
  "Web Contributor": "React, Next.js, TypeScript, Tailwind, Node.js",
  "AI/ML Contributor": "Python, TensorFlow, PyTorch, NumPy, Pandas, Scikit-learn",
  "Cloud & DevOps Contributor": "Docker, Kubernetes, AWS, Terraform, CI/CD",
};

const SkillGraphSection = () => {
  const [skills, setSkills] = useState(sampleProfiles["Frontend Dev"]);
  const [graphData, setGraphData] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleAnalyze = () => {
    if (!skills) return;
    startTransition(async () => {
      const result = await analyzeSkills({ skills });
      if (result && result.skillGraphData) {
        try {
          const parsedData = JSON.parse(result.skillGraphData);
          setGraphData(parsedData);
        } catch (e) {
          console.error("Failed to parse skill graph data", e);
          setGraphData(null);
        }
      }
    });
  };

  const handleSampleProfile = (key) => {
    setSkills(sampleProfiles[key]);
    setGraphData(null);
  }

  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-white">
            See your developer strengths come alive
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Our AI maps your skills into a unique graph that reveals your natural areas of contribution — helping us recommend open-source projects where you’ll thrive
          </p>
        </div>
        
        <Card className="bg-[#1a1a1a]/80 border-white/10 backdrop-blur-sm overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-8 border-b md:border-b-0 md:border-r border-white/10">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-headline text-white">Skill Analyzer</CardTitle>
                <CardDescription className="text-gray-400">
                  Enter skills separated by commas.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Sample Profiles</label>
                    <div className="flex flex-wrap gap-2">
                        {Object.keys(sampleProfiles).map(key => (
                            <Button key={key} variant="outline" size="sm" onClick={() => handleSampleProfile(key)}>
                                {key}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                  <Input 
                    placeholder="e.g., React, Node.js, Python" 
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="bg-black/30 border-white/20 h-12"
                  />
                </div>
                <Button onClick={handleAnalyze} disabled={isPending} className="w-full h-12 text-base">
                  {isPending ? <Loader2 className="animate-spin mr-2" /> : <Zap className="mr-2" />}
                  Analyze & Visualize
                </Button>
              </CardContent>
            </div>
            
            <div className="min-h-[400px] md:min-h-0 relative bg-black/20">
              {isPending && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#1a1a1a]/50">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                </div>
              )}
              <SkillGraph graphData={graphData} />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default SkillGraphSection;
