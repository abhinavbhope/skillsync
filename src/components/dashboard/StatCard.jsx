'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedCounter from '@/components/ui/animated-counter';

const GlassmorphicCard = ({ children, className }) => (
    <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg ${className}`}>
        {children}
    </div>
);


const StatCard = ({ title, value, icon, description }) => {
    const isNumeric = !isNaN(parseFloat(value)) && isFinite(value);
    
    return (
        <GlassmorphicCard className="p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent className="p-0">
                <div className="text-2xl font-bold text-white">
                    {isNumeric ? <AnimatedCounter to={value} /> : value}
                </div>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </CardContent>
        </GlassmorphicCard>
    );
};

export default StatCard;
