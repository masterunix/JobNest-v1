import React from 'react';

const SQUARES = [
  { left: '10%', size: 40, delay: 0, duration: 12, color: 'bg-primary-200 dark:bg-primary-800', opacity: 0.6 },
  { left: '30%', size: 60, delay: 2, duration: 16, color: 'bg-secondary-200 dark:bg-secondary-800', opacity: 0.5 },
  { left: '55%', size: 32, delay: 4, duration: 10, color: 'bg-primary-300 dark:bg-primary-700', opacity: 0.4 },
  { left: '70%', size: 50, delay: 1, duration: 14, color: 'bg-secondary-300 dark:bg-secondary-700', opacity: 0.4 },
  { left: '85%', size: 36, delay: 3, duration: 18, color: 'bg-primary-100 dark:bg-primary-900', opacity: 0.5 },
];

export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {SQUARES.map((sq, i) => (
        <div
          key={i}
          className={`absolute ${sq.color} rounded-lg animate-float-square border border-gray-400 dark:border-gray-600 transition-colors duration-200`}
          style={{
            left: sq.left,
            width: sq.size,
            height: sq.size,
            bottom: -sq.size,
            opacity: sq.opacity,
            animationDelay: `${sq.delay}s`,
            animationDuration: `${sq.duration}s`,
          }}
        />
      ))}
      {/* Custom animation keyframes */}
      <style>{`
        @keyframes float-square {
          0% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-40vh) scale(1.1) rotate(10deg);
            opacity: 0.9;
          }
          100% {
            transform: translateY(-80vh) scale(1) rotate(-8deg);
            opacity: 0.3;
          }
        }
        .animate-float-square {
          animation-name: float-square;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
} 