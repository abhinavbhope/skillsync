'use client';
import { motion } from 'framer-motion';

const FloatingElements = () => {
    const elements = [
        { size: 'w-64 h-64', top: '10%', left: '5%', delay: 0 },
        { size: 'w-48 h-48', top: '20%', left: '80%', delay: 2 },
        { size: 'w-32 h-32', top: '70%', left: '15%', delay: 4 },
        { size: 'w-56 h-56', top: '80%', left: '70%', delay: 1 },
        { size: 'w-40 h-40', top: '50%', left: '40%', delay: 3 },
        { size: 'w-72 h-72', top: '-10%', left: '60%', delay: 5 },
        { size: 'w-24 h-24', top: '90%', left: '5%', delay: 6 },
        { size: 'w-80 h-80', top: '40%', left: '-20%', delay: 7 },
        { size: 'w-96 h-96', top: '5%', left: '30%', delay: 1.5 },
        { size: 'w-20 h-20', top: '85%', left: '90%', delay: 3.5 },
        { size: 'w-60 h-60', top: '60%', left: '5%', delay: 2.5 },
        { size: 'w-72 h-72', top: '-15%', left: '-10%', delay: 6.5 },
    ];

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
            {elements.map((el, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-primary/10 rounded-full"
                    style={{ top: el.top, left: el.left }}
                    animate={{
                        y: [0, -20, 0, 20, 0],
                        x: [0, 10, -10, 10, 0],
                        scale: [1, 1.05, 1, 0.95, 1],
                    }}
                    transition={{
                        duration: 15 + Math.random() * 10,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: el.delay,
                    }}
                >
                    <div className={`${el.size} rounded-full filter blur-2xl`}></div>
                </motion.div>
            ))}
        </div>
    );
};

export default FloatingElements;
