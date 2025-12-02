'use client';
import { useState, useEffect } from 'react';

const useCountUp = (end, start = 0, duration = 1500) => {
    const [count, setCount] = useState(start);
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);

    useEffect(() => {
        let frame = 0;
        const counter = setInterval(() => {
            frame++;
            const progress = (frame / totalFrames);
            const currentCount = Math.round(end * progress);
            setCount(currentCount > end ? end : currentCount);

            if (frame === totalFrames) {
                clearInterval(counter);
            }
        }, frameRate);
        
        return () => clearInterval(counter);

    }, [end, duration, totalFrames, frameRate]);

    return count;
};

export default useCountUp;
