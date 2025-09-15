"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  numberOfElements?: number;
}

export default function AnimatedBackground({ numberOfElements = 6 }: AnimatedBackgroundProps) {
  // Generar array de elementos únicos con IDs únicos
  const elements = React.useMemo(() => 
    Array.from({ length: numberOfElements }, (_, i) => ({
      id: `animated-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
      width: Math.random() * 100 + 50,
      height: Math.random() * 100 + 50,
      top: Math.random() * 100,
      left: Math.random() * 100,
      yMovement: Math.random() * 30 - 15,
      xMovement: Math.random() * 30 - 15,
      duration: Math.random() * 5 + 3,
    })), [numberOfElements]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute rounded-full bg-white/10 backdrop-blur-sm"
          style={{
            width: `${element.width}px`,
            height: `${element.height}px`,
            top: `${element.top}%`,
            left: `${element.left}%`,
          }}
          animate={{
            y: [0, element.yMovement],
            x: [0, element.xMovement],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}