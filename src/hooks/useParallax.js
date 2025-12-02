'use client';
import { useEffect } from 'react';
import { useScroll, useSpring, useTransform } from 'framer-motion';

export const useParallax = (ref, speed) => {
    const { scrollY } = useScroll();
    const y = useSpring(useTransform(scrollY, [0, 500], [0, 500 * speed]), {
        damping: 30,
        stiffness: 200,
    });

    useEffect(() => {
        const unsubscribe = y.on('change', (latest) => {
            if (ref.current) {
                ref.current.style.transform = `translateY(${latest}px)`;
            }
        });
        return unsubscribe;
    }, [y, ref]);

    return y;
};
