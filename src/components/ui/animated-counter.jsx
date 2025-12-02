"use client";
import React, { useEffect, useState } from 'react';

const AnimatedCounter = ({ to }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(to);
    if (start === end) return;

    const duration = 2000;
    const incrementTime = (duration / end) > 0 ? (duration / end) : 1;

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [to]);

  return <span>{count.toLocaleString()}</span>;
};

export default AnimatedCounter;
