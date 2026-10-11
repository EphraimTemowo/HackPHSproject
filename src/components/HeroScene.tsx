import Starfield from './Starfield';
import MoonPhaseSVG from './MoonPhaseSVG';
import { getMoonPhase } from '@/lib/astronomy';
import { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';

interface HeroSceneProps {
  onScrollDown: () => void;
}

/**
 * The hero scene: a night beach with the Moon rising above the ocean,
 * with approximately 30% of the Moon covered by water.
 */
export default function HeroScene({ onScrollDown }: HeroSceneProps) {
  const moonPhase = useMemo(() => getMoonPhase(new Date()), []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-night-deep">
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-night-deep via-night-dark to-night-mid" />

      {/* Stars */}
      <Starfield count={180} />

      {/* Moon glow on the sky */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          top: '32%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(244,228,188,0.15) 0%, rgba(244,228,188,0.05) 30%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* The Moon — positioned so ~30% overlaps with the water below */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '32%',
          transform: 'translate(-50%, -50%)',
          animation: 'float 8s ease-in-out infinite',
        }}
      >
        <MoonPhaseSVG
          phaseFraction={moonPhase.phaseFraction}
          size={220}
          glow
        />
      </div>

      {/* Moonlight reflection on water */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          bottom: '15%',
          transform: 'translateX(-50%)',
          width: '120px',
          height: '200px',
          background: 'linear-gradient(180deg, rgba(244,228,188,0.25) 0%, rgba(244,228,188,0.08) 50%, transparent 100%)',
          filter: 'blur(8px)',
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
        }}
      />

      {/* Ocean — starts below the moon, covering ~30% of it */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '42%' }}>
        {/* Deep ocean gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-mid via-ocean-dark to-ocean-deep" />

        {/* Water surface shimmer */}
        <div
          className="absolute top-0 left-0 right-0 water-shimmer"
          style={{ height: '60px' }}
        />

        {/* Wave layers */}
        <WaveLayer
          color="rgba(74, 138, 181, 0.15)"
          height="50px"
          bottom="55%"
          duration="7s"
          delay="0s"
        />
        <WaveLayer
          color="rgba(74, 138, 181, 0.2)"
          height="60px"
          bottom="35%"
          duration="6s"
          delay="1s"
        />
        <WaveLayer
          color="rgba(42, 90, 130, 0.3)"
          height="70px"
          bottom="15%"
          duration="8s"
          delay="0.5s"
        />
        <WaveLayer
          color="rgba(26, 58, 92, 0.5)"
          height="80px"
          bottom="0%"
          duration="9s"
          delay="2s"
        />

        {/* Foam line at the water's edge */}
        <div
          className="absolute left-0 right-0"
          style={{
            top: '-2px',
            height: '4px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(200,220,240,0.4) 20%, rgba(200,220,240,0.6) 50%, rgba(200,220,240,0.4) 80%, transparent 100%)',
            filter: 'blur(2px)',
          }}
        />
      </div>

      {/* Beach sand at the very bottom */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '8%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(154,138,106,0.3) 20%, rgba(201,184,150,0.6) 60%, rgba(232,220,192,0.8) 100%)',
          clipPath: 'polygon(0 30%, 15% 15%, 35% 25%, 55% 10%, 75% 20%, 100% 12%, 100% 100%, 0 100%)',
        }}
      />

      {/* Title overlay */}
      <div className="relative z-10 flex h-full flex-col items-center justify-start pt-[12vh] px-4">
        <h1 className="font-serif text-6xl md:text-8xl font-light tracking-wide text-moon-light moon-text-glow text-balance text-center animate-fade-in">
          Praia da Lúa
        </h1>
        <p className="mt-4 font-sans text-sm md:text-base font-light tracking-[0.3em] uppercase text-moon-mid/80 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          Moon · Beach · Tides
        </p>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={onScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-moon-mid/60 hover:text-moon-light transition-colors duration-300 animate-fade-in"
        style={{ animationDelay: '1s' }}
        aria-label="Scroll down to search"
      >
        <span className="text-xs font-light tracking-widest uppercase">Find your beach</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </button>

      {/* Vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(5,7,20,0.5) 100%)',
        }}
      />
    </section>
  );
}

function WaveLayer({
  color,
  height,
  bottom,
  duration,
  delay,
}: {
  color: string;
  height: string;
  bottom: string;
  duration: string;
  delay: string;
}) {
  return (
    <div
      className="absolute left-0 right-0"
      style={{ bottom, height }}
    >
      <svg
        className="absolute inset-0 w-[200%] h-full"
        style={{ animation: `wave ${duration} ease-in-out ${delay} infinite` }}
        preserveAspectRatio="none"
        viewBox="0 0 1440 100"
      >
        <path
          d="M0,50 C240,80 480,20 720,50 C960,80 1200,20 1440,50 L1440,100 L0,100 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
