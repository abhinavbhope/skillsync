"use client";

import React from 'react';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import AnimatedCounter from '@/components/ui/animated-counter';

const stats = [
  { value: 120000, label: 'Repositories Analyzed', suffix: '+' },
  { value: 35000, label: 'OSS Matches Delivered', suffix: '+' },
  { value: 94, label: 'Match Relevance Score', suffix: '%' },
];

const StatsSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <section id="stats" ref={ref} className="py-20 sm:py-24 bg-transparent">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className={cn(
              "transition-opacity duration-1000",
              inView ? "opacity-100" : "opacity-0"
            )} style={{ transitionDelay: `${index * 200}ms` }}>
              <div className="font-headline text-5xl md:text-6xl font-bold text-primary">
                {inView && <AnimatedCounter to={stat.value} />}
                {stat.suffix}
              </div>
              <p className="mt-2 text-lg text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
