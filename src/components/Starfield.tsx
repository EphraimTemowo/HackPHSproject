import { useMemo } from 'react';

interface StarfieldProps {
  count?: number;
  className?: string;
}

interface Star {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

export default function Starfield({ count = 150, className = '' }: StarfieldProps) {
  const stars = useMemo<Star[]>(() => {
    const arr: Star[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: Math.random() * 100,
        y: Math.random() * 70, // keep stars in the sky portion
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 4,
        duration: Math.random() * 3 + 2,
        opacity: Math.random() * 0.6 + 0.3,
      });
    }
    return arr;
  }, [count]);

  // A few brighter "feature" stars
  const brightStars = useMemo<Star[]>(() => {
    const arr: Star[] = [];
    for (let i = 0; i < 8; i++) {
      arr.push({
        x: Math.random() * 100,
        y: Math.random() * 50,
        size: Math.random() * 1.5 + 2,
        delay: Math.random() * 3,
        duration: Math.random() * 2 + 3,
        opacity: 0.8,
      });
    }
    return arr;
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {stars.map((star, i) => (
        <div
          key={`star-${i}`}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
      {brightStars.map((star, i) => (
        <div
          key={`bright-${i}`}
          className="absolute rounded-full bg-moon-light"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            boxShadow: '0 0 6px rgba(253, 246, 227, 0.8), 0 0 12px rgba(253, 246, 227, 0.4)',
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
