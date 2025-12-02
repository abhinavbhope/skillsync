'use client';

import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ErrorState = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="mt-12"
    >
      <Card className="bg-destructive/10 border-destructive/50 text-destructive-foreground">
        <CardContent className="p-6 flex items-center gap-4">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <div>
            <h3 className="font-bold text-lg">Analysis Failed</h3>
            <p className="text-sm">{message}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ErrorState;
